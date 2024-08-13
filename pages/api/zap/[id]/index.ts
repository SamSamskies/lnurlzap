import type { NextApiRequest, NextApiResponse } from "next";
import { requestPayServiceParams } from "lnurl-pay";
import {
  extractLnurlOrLightningAddress,
  findEvent,
  getPubkeyToZap,
  getUserProfile,
  getNip19Id,
} from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const normalizeId = (id?: string | string[]) => {
    if (!id || Array.isArray(id)) {
      throw new Error("There must be one and only one id.");
    }

    return getNip19Id(id) ?? id;
  };
  const fetchLnurlServiceParams = async (id: string) => {
    try {
      const event = await findEvent(id);

      if (!event) {
        throw new Error(`Event with ID ${id} not found.`);
      }

      const isProfileZap = event.kind === 0;
      const profileMetadataEvent = isProfileZap
        ? event
        : await getUserProfile(getPubkeyToZap(event));

      if (!profileMetadataEvent) {
        throw new Error("Kind 0 (nostr profile metadata) event not found.");
      }

      const lnUrlOrAddress =
        extractLnurlOrLightningAddress(profileMetadataEvent);

      if (!lnUrlOrAddress) {
        throw new Error(
          "User does not have a lightning address or LNURL in their Nostr profile.",
        );
      }

      const { rawData } = await requestPayServiceParams({
        lnUrlOrAddress,
      });

      return {
        ...rawData,
        callback: `${process.env.NEXT_PUBLIC_LNURLZAP_BASE_URL}/api/zap/${id}/callback`,
      };
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
        result = await fetchLnurlServiceParams(normalizeId(req.query.id));
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
