"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui";
import { isAsking, setConsent, subscribe } from "./consent";
import styles from "./CookieBanner.module.css";

/** Asks once, with Accept and Decline given the same weight. Nothing is set before an answer. */
export function CookieBanner() {
  const asking = useSyncExternalStore(subscribe, isAsking, () => false);
  if (!asking) return null;
  return (
    <section className={styles.banner} role="dialog" aria-label="Cookies" aria-live="polite">
      <p className={styles.title}>Cookies</p>
      <p className={styles.text}>
        We&apos;d like to use Google Analytics to see which pages are useful. It sets two cookies
        (<code>_ga</code> and <code>_ga_*</code>). Nothing loads unless you accept.{" "}
        <Link href="/privacy">More about privacy</Link>.
      </p>
      <div className={styles.actions}>
        <Button size="sm" onClick={() => setConsent("granted")}>
          Accept
        </Button>
        <Button size="sm" onClick={() => setConsent("denied")}>
          Decline
        </Button>
      </div>
    </section>
  );
}
