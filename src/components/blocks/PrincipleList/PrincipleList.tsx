import { Text } from "@/components/ui";
import { cx } from "@/lib/cx";
import styles from "./PrincipleList.module.css";

export type Principle = { title: string; text: string };

type PrincipleListProps = {
  items: readonly Principle[];
  /** stack: one card per row. grid: cards side by side when there is room. */
  layout?: "stack" | "grid";
};

/** Cards, each with a numbered serif title above its explanation. */
export function PrincipleList({ items, layout = "stack" }: PrincipleListProps) {
  return (
    <ul className={cx(styles.list, layout === "grid" && styles.grid)} data-reveal="stagger">
      {items.map((item, index) => (
        <li key={item.title} className={styles.card}>
          <span className={styles.index} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <strong className={styles.title}>{item.title}</strong>
          <Text tone="muted" measure="none">
            {item.text}
          </Text>
        </li>
      ))}
    </ul>
  );
}
