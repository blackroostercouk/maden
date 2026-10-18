import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Tag.module.css";

type TagProps = {
  tone?: "default" | "accent";
  className?: string;
  children: ReactNode;
};

/** Outlined label for short metadata, such as which plans support a feature. */
export function Tag({ tone = "default", className, children }: TagProps) {
  return <span className={cx(styles.tag, styles[tone], className)}>{children}</span>;
}
