import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import React from "react";

interface LnurlQrCodeProps {
  lnurl: string;
  size: number;
  style?: React.CSSProperties;
  asCanvas?: boolean;
}

export const LnurlQrCode: React.FC<LnurlQrCodeProps> = ({
  lnurl,
  size,
  style,
  asCanvas = false,
}) => {
  const QrCode = asCanvas ? QRCodeCanvas : QRCodeSVG;

  return (
    <QrCode
      value={`lightning:${lnurl}`}
      includeMargin
      size={size}
      style={style}
    />
  );
};
