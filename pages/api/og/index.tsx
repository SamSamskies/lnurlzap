import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler() {
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
        <div>LNURL Zap</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
