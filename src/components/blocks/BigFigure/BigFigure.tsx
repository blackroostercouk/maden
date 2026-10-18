import { Eyebrow, Text } from "@/components/ui";
import styles from "./BigFigure.module.css";

type BigFigureProps = {
  eyebrow: string;
  value: number;
  prefix?: string;
  text: string;
  note?: string;
  labelId?: string;
};

/** A large number that counts up once, with an explanation beside it. */
export function BigFigure({ eyebrow, value, prefix = "", text, note, labelId }: BigFigureProps) {
  const formatted = `${prefix}${value.toLocaleString("en-GB")}`;
  return (
    <aside className={styles.figure} aria-labelledby={labelId}>
      <Eyebrow id={labelId}>{eyebrow}</Eyebrow>
      <p className={styles.value} data-count-to={value} data-count-prefix={prefix}>
        {formatted}
      </p>
      <Text size="lg" weight="book" measure="narrow">
        {text}
      </Text>
      {note && (
        <Text size="xs" tone="muted">
          {note}
        </Text>
      )}
    </aside>
  );
}
