import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useRef, useState } from "react";

interface LnurlQrCodePngProps {
  lnurl: string;
  size: number;
  style?: React.CSSProperties;
}

export const LnurlQrCodePng: React.FC<LnurlQrCodePngProps> = ({
  lnurl,
  size,
  style,
}) => {
  const qrRef = useRef<HTMLDivElement | null>(null);
  const [pngUrl, setPngUrl] = useState("");

  useEffect(() => {
    if (qrRef.current && "querySelector" in qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");

      if (canvas instanceof HTMLCanvasElement) {
        const pngUrl = canvas.toDataURL("image/png");

        setPngUrl(pngUrl);
      }
    }
  }, [lnurl]);

  return (
    <div>
      {pngUrl ? (
        <img src={pngUrl} alt="QR Code" style={style} />
      ) : (
        <div ref={qrRef}>
          <QRCodeCanvas
            value={`lightning:${lnurl}`}
            includeMargin
            size={size}
            style={style}
          />
        </div>
      )}
    </div>
  );
};
