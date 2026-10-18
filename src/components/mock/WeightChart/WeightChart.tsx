import type { CSSProperties } from "react";
import styles from "./WeightChart.module.css";

export type WeightItem = { label: string; kb: number };

type WeightChartProps = {
  items: WeightItem[];
  totalLabel: string;
  ours: WeightItem;
};

/** Horizontal bars comparing script weight, scaled to the heaviest item. */
export function WeightChart({ items, totalLabel, ours }: WeightChartProps) {
  const max = Math.max(...items.map((item) => item.kb));
  const total = items.reduce((sum, item) => sum + item.kb, 0);
  const bar = (kb: number) => ({ "--w": kb / max }) as CSSProperties;

  return (
    <ul className={styles.chart} data-reveal="bars">
      {items.map((item) => (
        <li key={item.label} className={styles.row}>
          <span>{item.label}</span>
          <i className={styles.bar} style={bar(item.kb)} />
          <b>{item.kb} KB</b>
        </li>
      ))}
      <li className={`${styles.row} ${styles.total}`}>
        <span>{totalLabel}</span>
        <span />
        <b>{total} KB</b>
      </li>
      <li className={`${styles.row} ${styles.ours}`}>
        <span>{ours.label}</span>
        <i className={styles.bar} style={bar(ours.kb)} />
        <b>{ours.kb} KB</b>
      </li>
    </ul>
  );
}
