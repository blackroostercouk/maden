import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Eyebrow.module.css";

type EyebrowProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Short accent label above a heading that names the section. */
export function Eyebrow({ id, className, children }: EyebrowProps) {
  return (
    <p id={id} className={cx(styles.eyebrow, className)}>
      {children}
    </p>
  );
}
