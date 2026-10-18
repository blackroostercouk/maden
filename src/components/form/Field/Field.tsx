import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Field.module.css";

type FieldProps = {
  /** id of the control the label points at. Omit for groups (uses fieldset/legend). */
  htmlFor?: string;
  label: string;
  error?: string;
  errorId?: string;
  className?: string;
  children: ReactNode;
};

/** Label, control and error message, with one layout for every form field. */
export function Field({ htmlFor, label, error, errorId, className, children }: FieldProps) {
  const errorNode = (
    <p id={errorId} className={styles.error} role={error ? "alert" : undefined}>
      {error}
    </p>
  );

  if (!htmlFor) {
    return (
      <fieldset className={cx(styles.field, styles.group, error && styles.invalid, className)}>
        <legend className={styles.label}>{label}</legend>
        {children}
        {errorNode}
      </fieldset>
    );
  }

  return (
    <div className={cx(styles.field, error && styles.invalid, className)}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
      {errorNode}
    </div>
  );
}
