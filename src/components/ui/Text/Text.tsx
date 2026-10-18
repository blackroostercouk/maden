import type { ElementType, ReactNode } from "react";
import type { FontWeight, Measure, TextTone } from "@/design/tokens";
import { cx } from "@/lib/cx";
import styles from "./Text.module.css";

type TextProps = {
  as?: ElementType;
  id?: string;
  /** xs captions · sm secondary · md body · lg lede */
  size?: "xs" | "sm" | "md" | "lg";
  tone?: TextTone;
  weight?: FontWeight;
  measure?: Measure;
  className?: string;
  children: ReactNode;
};

export function Text({
  as: Tag = "p",
  id,
  size = "md",
  tone = "default",
  weight,
  measure = "default",
  className,
  children,
}: TextProps) {
  return (
    <Tag
      id={id}
      className={cx(
        styles.text,
        styles[`size-${size}`],
        styles[`tone-${tone}`],
        weight && styles[`weight-${weight}`],
        styles[`measure-${measure}`],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
