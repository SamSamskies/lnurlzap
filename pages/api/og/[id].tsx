import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { encodeLnurl, truncateId } from "@/utils";
import { QRCodeSVG } from "qrcode.react";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") as string;
  const lnurl = encodeLnurl(id);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
          color: "white",
          fontSize: 80,
          fontWeight: 600,
        }}
      >
        <QRCodeSVG value={`lightning:${lnurl}`} size={424} includeMargin />
        <div style={{ display: "flex", fontSize: 48, marginTop: 20 }}>
          Scan to zap {truncateId(id)}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
