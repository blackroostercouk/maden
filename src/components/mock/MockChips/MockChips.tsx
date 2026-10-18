import styles from "./MockChips.module.css";

/** A row of small positive chips. */
export function MockChips({ items }: { items: string[] }) {
  return (
    <div className={styles.chips}>
      {items.map((item) => (
        <span key={item} className={styles.chip}>
          {item}
        </span>
      ))}
    </div>
  );
}
