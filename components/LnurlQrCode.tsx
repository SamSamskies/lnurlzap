import { QRCodeSVG } from "qrcode.react";
import React from "react";

interface LnurlQrCodeProps {
  lnurl: string;
  size: number;
  style?: React.CSSProperties;
}

export const LnurlQrCode: React.FC<LnurlQrCodeProps> = ({
  lnurl,
  size,
  style,
}) => {
  return (
    <QRCodeSVG
      value={`lightning:${lnurl}`}
      includeMargin
      size={size}
      style={style}
    />
  );
};
