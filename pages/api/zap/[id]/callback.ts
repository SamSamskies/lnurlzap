import type { NextApiRequest, NextApiResponse } from "next";
import {
  DEFAULT_RELAYS,
  findEvent,
  getRelayListMetadata,
  getUserProfileAndRelayListMetadata,
  getPubkeyToZap,
  getAddressPointer,
} from "@/utils";
import * as nip57 from "nostr-tools/nip57";
import { finalizeEvent, generateSecretKey } from "nostr-tools/pure";
import type { Event } from "nostr-tools/core";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
    if (Array.isArray(comment)) {
      throw new Error("There must be one and only one comment.");
    }

    return comment ?? "";
  };
  const getProfileMetadataAndWriteRelays = async (
    event: Event,
    isProfileZap: boolean,
  ) => {
    let profileMetadataEvent = null;
    let relayListMetadataEvent = null;

    if (isProfileZap) {
      profileMetadataEvent = event;
      relayListMetadataEvent = await getRelayListMetadata(
        getPubkeyToZap(event),
      );
    } else {
      const metadataEvents = await getUserProfileAndRelayListMetadata(
        getPubkeyToZap(event),
      );

      profileMetadataEvent = metadataEvents.find(({ kind }) => kind === 0);
      relayListMetadataEvent = metadataEvents.find(
        ({ kind }) => kind === 10002,
      );
    }

    const writeRelays = relayListMetadataEvent
      ? (relayListMetadataEvent as Event).tags
          .filter(([_, __, type]) => type !== "read")
          .map(([_, relayUri]) => relayUri)
      : [];

    return { profileMetadataEvent, writeRelays };
  };
  const fetchInvoice = async ({
    id,
    amount,
    comment,
  }: {
    id: string;
    amount: number;
    comment: string;
  }) => {
    try {
      const event = await findEvent(id);

      if (!event) {
        throw new Error(`Event with ID ${id} not found.`);
      }

      const isProfileZap = event.kind === 0;
      const { profileMetadataEvent, writeRelays } =
        await getProfileMetadataAndWriteRelays(event, isProfileZap);

      if (!profileMetadataEvent) {
        throw new Error("Kind 0 (nostr profile metadata) event not found.");
      }

      const zapEndpoint = await nip57.getZapEndpoint(profileMetadataEvent);

      if (!zapEndpoint) {
        throw new Error("No lightning address or LNURL found for user.");
      }

      const addressPointer = getAddressPointer(id);

      // @ts-ignore
      const zapRequestEvent = nip57.makeZapRequest({
        profile: getPubkeyToZap(profileMetadataEvent),
        event: isProfileZap || addressPointer ? null : event.id,
        amount,
        comment,
        relays: writeRelays.length === 0 ? DEFAULT_RELAYS : writeRelays,
      });

      // @ts-ignore
      zapRequestEvent.tags.push(["anon"]);

      if (addressPointer) {
        // @ts-ignore
        zapRequestEvent.tags.push(["a", addressPointer]);
      }

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
