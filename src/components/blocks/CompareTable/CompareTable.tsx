import styles from "./CompareTable.module.css";

export type CompareRow = { aspect: string; theirs: string; ours: string };

type CompareTableProps = {
  label: string;
  columns: { theirs: string; ours: string };
  rows: readonly CompareRow[];
};

/**
 * Two-way comparison. A table on wide screens; on phones each row
 * becomes a stacked card with labelled cells.
 */
export function CompareTable({ label, columns, rows }: CompareTableProps) {
  return (
    <div className={styles.table} role="table" aria-label={label}>
      <div className={`${styles.row} ${styles.head}`} role="row">
        <span role="columnheader">
          <span className="sr-only">Aspect</span>
        </span>
        <span role="columnheader">{columns.theirs}</span>
        <span role="columnheader" className={styles.oursHead}>
          {columns.ours}
        </span>
      </div>
      {rows.map((row) => (
        <div key={row.aspect} className={styles.row} role="row" data-reveal="stagger">
          <span className={styles.aspect} role="rowheader">
            {row.aspect}
          </span>
          <span className={styles.theirs} role="cell" data-col={columns.theirs} data-stagger-item>
            {row.theirs}
          </span>
          <span className={styles.ours} role="cell" data-col={columns.ours} data-stagger-item>
            {row.ours}
          </span>
        </div>
      ))}
    </div>
  );
}
