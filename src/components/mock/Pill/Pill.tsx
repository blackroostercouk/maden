import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Pill.module.css";

type PillProps = {
  tone?: "positive" | "warning";
  className?: string;
  children: ReactNode;
};

/** Small status label inside interface cards. */
export function Pill({ tone = "positive", className, children }: PillProps) {
  return <em className={cx(styles.pill, styles[tone], className)}>{children}</em>;
}
