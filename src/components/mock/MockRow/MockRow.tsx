import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./MockRow.module.css";

type MockRowProps = {
  label: ReactNode;
  value: ReactNode;
  /** Total rows get a rule above and a larger value. */
  total?: boolean;
};

export function MockRow({ label, value, total = false }: MockRowProps) {
  return (
    <div className={cx(styles.row, total && styles.total)}>
      <span>{label}</span>
      {total ? <b>{value}</b> : <span>{value}</span>}
    </div>
  );
}
