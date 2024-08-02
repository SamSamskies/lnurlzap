import styles from "./Home.module.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { validateNostrId } from "@/utils";
import Head from "next/head";

export const Home = () => {
  const description = "Generate an LNURL for any Nostr event 🎉";
  const ogImage = `${process.env.NEXT_PUBLIC_LNURLZAP_BASE_URL}/api/og`;
  const router = useRouter();
  const [error, setError] = useState("");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements[0] as HTMLFormElement;
    const id = input.value.replace(/^nostr:/, "").trim();

    if (validateNostrId(id)) {
      return router.push(`/${id}`);
    } else {
      setError("Invalid Nostr ID.");
    }
  };

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
        <h1>Generate an LNURL for any Nostr event 🎉</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            autoFocus
            className={styles.input}
            placeholder="Enter any Nostr ID e.g. note ID, npub, nevent, etc."
          />
          <button className={styles.button} type="submit">
            Generate LNURL
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </main>
    </>
  );
};
