import { cx } from "@/lib/cx";
import { Icon } from "../Icon";
import styles from "./CheckList.module.css";

export type CheckItem = {
  title: string;
  text: string;
};

type CheckListProps = {
  items: CheckItem[];
  /** plain: compact list. ruled: hairlines between items. */
  variant?: "plain" | "ruled";
  /** Colour of the supporting text after each title. */
  detailTone?: "soft" | "muted";
  className?: string;
};

/** A list of short claims, each led by a check mark and a bold title. */
export function CheckList({
  items,
  variant = "plain",
  detailTone = "soft",
  className,
}: CheckListProps) {
  return (
    <ul className={cx(styles.list, styles[variant], className)}>
      {items.map((item) => (
        <li key={item.title} className={styles.item}>
          <Icon name="check" className={styles.icon} />
          <p>
            <strong className={styles.title}>{item.title}</strong>{" "}
            <span className={styles[`detail-${detailTone}`]}>{item.text}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
