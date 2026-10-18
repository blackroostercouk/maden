import { cx } from "@/lib/cx";
import styles from "./Toggle.module.css";

/** Static switch graphic for illustrations (not an input). */
export function Toggle({ on = false }: { on?: boolean }) {
  return <i aria-hidden="true" className={cx(styles.toggle, on && styles.on)} />;
}
