import { Fragment, type ReactNode } from "react";
import type { FontFamily, FontSize, FontWeight, TextTone } from "@/design/tokens";
import { cx } from "@/lib/cx";
import styles from "./Heading.module.css";

/** Weights a heading can ask for beyond its default. */
export type HeadingWeight = Extract<FontWeight, "light" | "regular" | "medium" | "semibold">;

export type HeadingLine = {
  text: string;
  tone?: TextTone;
  /** Weight for this line alone, for example a light accent line under a semibold one. */
  weight?: HeadingWeight;
  italic?: boolean;
};

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  id?: string;
  size?: FontSize;
  family?: FontFamily;
  tone?: TextTone;
  /** Heavier or lighter than the default, for headings that need more presence, such as the hero. */
  weight?: HeadingWeight;
  italic?: boolean;
  /** Split into words so the motion layer can reveal them. Text stays readable without JavaScript. */
  reveal?: boolean;
  /** Mark the words for the hero intro timeline instead of a scroll reveal. */
  intro?: boolean;
  /** Multi-line headings with per-line styling. Overrides children. */
  lines?: HeadingLine[];
  className?: string;
  children?: ReactNode;
};

function Words({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  // The space sits between word boxes: inside an inline-block it would collapse.
  return words.map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      <span className={styles.word}>
        <span className={styles.wordInner} data-word>
          {word}
        </span>
      </span>
      {index < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

export function Heading({
  as: Tag = "h2",
  id,
  size = "2xl",
  family = "display",
  tone = "default",
  weight,
  italic = false,
  reveal = false,
  intro = false,
  lines,
  className,
  children,
}: HeadingProps) {
  const split = reveal || intro;
  const plainText = lines
    ? lines.map((line) => line.text).join(" ")
    : typeof children === "string"
      ? children
      : null;

  const classes = cx(
    styles.heading,
    styles[`size-${size}`],
    styles[`family-${family}`],
    styles[`tone-${tone}`],
    weight && styles[`weight-${weight}`],
    italic && styles.italic,
    className,
  );

  const motionAttrs = split ? { "data-reveal": intro ? "intro-words" : "words" } : {};

  if (lines) {
    return (
      <Tag id={id} className={classes} {...motionAttrs}>
        {split && <span className="sr-only">{plainText}</span>}
        <span aria-hidden={split || undefined}>
          {lines.map((line) => (
            <span
              key={line.text}
              className={cx(
                styles.line,
                line.tone && styles[`tone-${line.tone}`],
                line.weight && styles[`weight-${line.weight}`],
                line.italic && styles.italic,
              )}
            >
              {split ? <Words text={line.text} /> : line.text}
            </span>
          ))}
        </span>
      </Tag>
    );
  }

  if (split && plainText) {
    return (
      <Tag id={id} className={classes} {...motionAttrs}>
        <span className="sr-only">{plainText}</span>
        <span aria-hidden="true">
          <Words text={plainText} />
        </span>
      </Tag>
    );
  }

  return (
    <Tag id={id} className={classes}>
      {children}
    </Tag>
  );
}
