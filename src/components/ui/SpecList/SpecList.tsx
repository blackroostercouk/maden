import { cx } from "@/lib/cx";
import styles from "./SpecList.module.css";

export type Spec = { term: string; detail: string };

type SpecListProps = {
  items: Spec[];
  className?: string;
} & Record<`data-${string}`, string | undefined>;

/** Short term/detail pairs, laid out as a responsive grid. */
export function SpecList({ items, className, ...data }: SpecListProps) {
  return (
    <dl className={cx(styles.list, className)}>
      {items.map((item) => (
        <div key={item.term} className={styles.item} {...data}>
          <dt className={styles.term}>{item.term}</dt>
          <dd className={styles.detail}>{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
