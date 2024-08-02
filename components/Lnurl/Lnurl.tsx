import styles from "./Lnurl.module.css";
import { QRCodeSVG } from "qrcode.react";
import { bech32 } from "bech32";
import { utf8ToBytes } from "@noble/hashes/utils";

const encodeLnurl = (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_LNURLZAP_BASE_URL}/api/zap/${id}`;
  const words = bech32.toWords(utf8ToBytes(url));

  return bech32.encode("lnurl", words, 1023).toUpperCase();
};

export const Lnurl = ({ id, error }: { id: string; error: string | null }) => {
  const lnurl = encodeLnurl(id);

  return (
    <main className={styles.main}>
      {!error && (
        <>
          <p className={styles.cta}>
            Scan this QR code with any lightning wallet to zap Nostr event {id}{" "}
            🎉
          </p>
          <QRCodeSVG
            value={`lightning:${lnurl}`}
            includeMargin
            size={500}
            style={{ width: "100%", height: "auto", margin: "40px 0" }}
          />
          <p>{lnurl}</p>
        </>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </main>
  );
};
