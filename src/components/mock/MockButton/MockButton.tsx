import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./MockButton.module.css";

type MockButtonProps = {
  variant?: "solid" | "outline" | "pill";
  children: ReactNode;
};

/** Button graphic for illustrations (not interactive). */
export function MockButton({ variant = "solid", children }: MockButtonProps) {
  return <span className={cx(styles.button, styles[variant])}>{children}</span>;
}
