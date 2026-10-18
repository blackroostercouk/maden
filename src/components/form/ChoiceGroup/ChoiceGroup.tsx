import styles from "./ChoiceGroup.module.css";

type ChoiceGroupProps = {
  name: string;
  /** radio: pick one. checkbox: pick any. */
  type: "radio" | "checkbox";
  options: readonly string[];
  value: string | string[];
  onChange: (value: string, checked: boolean) => void;
  idPrefix: string;
  describedBy?: string;
};

/** Pill-shaped radio or checkbox options. */
export function ChoiceGroup({
  name,
  type,
  options,
  value,
  onChange,
  idPrefix,
  describedBy,
}: ChoiceGroupProps) {
  const isChecked = (option: string) =>
    Array.isArray(value) ? value.includes(option) : value === option;

  return (
    <div className={styles.group}>
      {options.map((option, index) => {
        const id = `${idPrefix}-${index}`;
        return (
          <label key={option} className={styles.choice} htmlFor={id}>
            <input
              id={id}
              type={type}
              name={name}
              value={option}
              checked={isChecked(option)}
              onChange={(event) => onChange(option, event.target.checked)}
              aria-describedby={describedBy}
              className={styles.input}
            />
            <span className={styles.pill}>{option}</span>
          </label>
        );
      })}
    </div>
  );
}
