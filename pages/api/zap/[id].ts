import type { NextApiRequest, NextApiResponse } from "next";
import { DEFAULT_RELAYS, findEvent, getUserProfile } from "@/utils";
import * as nip57 from "nostr-tools/nip57";
import { finalizeEvent, generateSecretKey } from "nostr-tools/pure";

interface Response {
  routes: [];
  [key: string]: any;
}

interface Success extends Response {
  pr: string;
}

interface Error extends Response {
  status: "ERROR";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Success | Error>,
) {
  const normalizeRelays = (relay?: string | string[]) => {
    if (!relay) {
      return [];
    }

    return (Array.isArray(relay) ? relay : relay.split(",")).map(
      decodeURIComponent,
    );
  };
  const normalizeId = (id?: string | string[]) => {
    if (!id || Array.isArray(id)) {
      throw new Error("There must be one and only one id.");
    }

    return id;
  };
  const normalizeAmount = (amount?: string | string[]) => {
    if (!amount || Array.isArray(amount)) {
      throw new Error("There must be one and only one amount.");
    }

    return Number(amount);
  };
  const normalizeComment = (comment?: string | string[]) => {
    if (!comment || Array.isArray(comment)) {
      throw new Error("There must be one and only one comment.");
    }

    return comment;
  };
  const fetchInvoice = async ({
    id,
    amount,
    comment,
    relays,
  }: {
    id: string;
    amount: number;
    comment: string;
    relays: string[];
  }) => {
    try {
      const event = await findEvent(relays, id);
      const isProfileZap = event.kind === 0;
      const profileMetadataEvent = isProfileZap
        ? event
        : await getUserProfile(event.pubkey, relays);

      if (!profileMetadataEvent) {
        throw new Error("Kind 0 (nostr profile metadata) event not found.");
      }

      const zapEndpoint = await nip57.getZapEndpoint(profileMetadataEvent);

      if (!zapEndpoint) {
        throw new Error("No lightning address or LNURL found for user.");
      }

      const zapRequestEvent = nip57.makeZapRequest({
        profile: profileMetadataEvent.pubkey,
        event: isProfileZap ? null : event.id,
        amount,
        comment,
        relays: relays.length === 0 ? DEFAULT_RELAYS : relays,
      });

      // @ts-ignore
      zapRequestEvent.tags.push(["anon"]);

      const signedZapRequestEvent = finalizeEvent(
        zapRequestEvent,
        generateSecretKey(),
      );

      let url = `${zapEndpoint}?amount=${amount}&nostr=${encodeURIComponent(
        JSON.stringify(signedZapRequestEvent),
      )}`;

      if (comment) {
        url = `${url}&comment=${encodeURIComponent(comment)}`;
      }

      return fetch(url).then((res) => res.json());
    } catch (err) {
      return {
        status: "ERROR",
        reason: err instanceof Error ? err.message : "Failed to fetch invoice.",
      };
    }
  };

  switch (req.method) {
    case "GET":
      let result = null;

      try {
        result = await fetchInvoice({
          id: normalizeId(req.query.id),
          amount: normalizeAmount(req.query.amount),
          comment: normalizeComment(req.query.comment),
          relays: normalizeRelays(req.query.relay),
        });
      } catch (err) {
        result = err instanceof Error ? err.message : "Something went wrong :(";
      }

      if (typeof result === "string") {
        console.error(result);
        res.status(500).end(result);
      } else if (result === null) {
        res.status(404).end();
      } else {
        res.status(200).json(result);
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
