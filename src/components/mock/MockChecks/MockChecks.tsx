import styles from "./MockChecks.module.css";

/** A list of completed checks, each with a filled tick. */
export function MockChecks({ items }: { items: string[] }) {
  return (
    <ul className={styles.list} data-reveal="ticks">
      {items.map((item) => (
        <li key={item} className={styles.item}>
          <i className={styles.tick} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
