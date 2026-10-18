import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import styles from "./TextInput.module.css";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };
type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };

/** Single-line underlined input. */
export function TextInput({ invalid, className, ...rest }: TextInputProps) {
  return (
    <input
      className={cx(styles.control, className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

/** Multi-line underlined input. */
export function TextArea({ invalid, className, ...rest }: TextAreaProps) {
  return (
    <textarea
      className={cx(styles.control, styles.area, className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}
