import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./MockOption.module.css";

type MockOptionProps = {
  label: ReactNode;
  trailing?: ReactNode;
  selected?: boolean;
};

/** A bordered choice row, highlighted when selected. */
export function MockOption({ label, trailing, selected = false }: MockOptionProps) {
  return (
    <div className={cx(styles.option, selected && styles.selected)}>
      <span>{label}</span>
      {trailing}
    </div>
  );
}
