import styles from "./MockTable.module.css";

type MockTableProps = {
  rows: Array<{ label: string; status: string }>;
};

/** Two-column activity table with a status on the right. */
export function MockTable({ rows }: MockTableProps) {
  return (
    <div className={styles.table}>
      {rows.map((row) => (
        <div key={row.label} className={styles.row}>
          <span>{row.label}</span>
          <span className={styles.status}>{row.status}</span>
        </div>
      ))}
    </div>
  );
}
