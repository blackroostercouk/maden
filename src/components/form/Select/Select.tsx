import type { SelectHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import inputStyles from "../TextInput/TextInput.module.css";
import styles from "./Select.module.css";

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  placeholder: string;
  options: readonly string[];
};

/** Underlined native select with a drawn chevron. */
export function Select({ placeholder, options, className, ...rest }: SelectProps) {
  return (
    <select className={cx(inputStyles.control, styles.select, className)} {...rest}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
