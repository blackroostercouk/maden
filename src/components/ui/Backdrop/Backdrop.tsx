import { cx } from "@/lib/cx";
import styles from "./Backdrop.module.css";

type BackdropProps = {
  /** rings: concentric green rings. weave: a perspective thread grid. */
  pattern?: "rings" | "weave";
  className?: string;
};

/** Decorative background layer. Place inside a positioned parent. */
export function Backdrop({ pattern = "rings", className }: BackdropProps) {
  return <div aria-hidden="true" className={cx(styles.backdrop, styles[pattern], className)} />;
}
