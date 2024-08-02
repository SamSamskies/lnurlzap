import type { NextApiRequest, NextApiResponse } from "next";
import { encodeLnurl } from "@/utils";

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

  switch (req.method) {
    case "GET":
      let result = null;

      try {
        result = encodeLnurl(normalizeId(req.query.id));
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
