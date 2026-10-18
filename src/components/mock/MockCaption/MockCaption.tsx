import type { ReactNode } from "react";
import styles from "./MockCaption.module.css";

/** Small grey supporting line inside an interface card. */
export function MockCaption({ children }: { children: ReactNode }) {
  return <p className={styles.caption}>{children}</p>;
}
