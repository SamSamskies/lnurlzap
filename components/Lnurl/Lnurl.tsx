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
            Scan this QR code with any lightning wallet to zap this Nostr event
            🎉
          </p>
          <iframe
            src={`https://njump.me/${id}?embed=yes`}
            className="nostr-embedded"
            style={{
              width: "100%",
              height: 400,
              border: "2px solid #C9C9C9",
              borderRadius: 10,
            }}
          ></iframe>
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
