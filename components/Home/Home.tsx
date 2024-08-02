import styles from "./Home.module.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { validateNostrId } from "@/utils";

export const Home = () => {
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
  );
};
