import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Eyebrow } from "../Eyebrow";
import { Heading } from "../Heading";
import { Text } from "../Text";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  intro?: ReactNode;
  /** split: heading left, intro right. stacked: everything in one column. */
  layout?: "split" | "stacked";
  className?: string;
};

/** The standard opening of a section: eyebrow, heading and an optional intro. */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  intro,
  layout = "split",
  className,
}: SectionHeaderProps) {
  return (
    <header className={cx(styles.header, styles[layout], className)}>
      <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow>
      <Heading id={titleId} size="2xl" reveal>
        {title}
      </Heading>
      {intro && (
        <Text tone="muted" className={styles.intro}>
          {intro}
        </Text>
      )}
    </header>
  );
}
