import styles from "./Lnurl.module.css";
import { LnurlQrCodePng } from "@/components/LnurlQrCodePng";
import { encodeLnurl, truncateId } from "@/utils";
import Head from "next/head";

export const Lnurl = ({ id, error }: { id: string; error: string | null }) => {
  const lnurl = encodeLnurl(id);
  const description = `Use any lightning wallet to zap ${truncateId(id)}`;
  const ogImage = `${process.env.NEXT_PUBLIC_LNURLZAP_BASE_URL}/api/og/${id}`;

  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Head>
      <main className={styles.main}>
        {!error && (
          <>
            <div className={styles.noteEmbedContainer}>
              <iframe
                src={`https://njump.me/${id}?embed=yes`}
                className="nostr-embedded"
                style={{
                  width: "100%",
                  height: 400,
                  border: "2px solid #C9C9C9",
                  borderRadius: 10,
                  marginBottom: 20,
                }}
              ></iframe>
              <div className={styles.noteQrCodeContainer}>
                <LnurlQrCodePng
                  lnurl={lnurl}
                  size={100}
                  style={{
                    width: 100,
                    height: "auto",
                  }}
                />
              </div>
            </div>
            <p className={styles.cta}>
              Scan this QR code with any lightning wallet to zap this Nostr
              event 🎉
            </p>
            <LnurlQrCodePng
              lnurl={lnurl}
              size={500}
              style={{ width: "100%", height: "auto" }}
            />
            <p>{lnurl}</p>
          </>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </main>
    </>
  );
};
