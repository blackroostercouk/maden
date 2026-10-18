import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Container } from "../Container";
import styles from "./Section.module.css";

type SectionProps = {
  id?: string;
  labelledBy?: string;
  /** Vertical rhythm. "flush-top" removes the top padding when the previous section already provides it. */
  spacing?: "default" | "flush-top" | "flush-bottom" | "none";
  tone?: "default" | "raised";
  bordered?: boolean;
  /** Wrap children in a Container. Turn off for full-bleed sections. */
  contained?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

export function Section({
  id,
  labelledBy,
  spacing = "default",
  tone = "default",
  bordered = false,
  contained = true,
  className,
  innerClassName,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx(
        styles.section,
        styles[`spacing-${spacing}`],
        tone === "raised" && styles.raised,
        bordered && styles.bordered,
        className,
      )}
    >
      {contained ? <Container className={innerClassName}>{children}</Container> : children}
    </section>
  );
}
