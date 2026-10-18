import type { ReactNode } from "react";
import styles from "./MockDraft.module.css";

/** Dashed box holding generated text awaiting approval. */
export function MockDraft({ children }: { children: ReactNode }) {
  return <p className={styles.draft}>{children}</p>;
}
