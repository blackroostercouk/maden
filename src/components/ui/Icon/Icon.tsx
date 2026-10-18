import { cx } from "@/lib/cx";
import styles from "./Icon.module.css";

const paths = {
  arrowRight: { viewBox: "0 0 16 16", d: "M2 8h11M9 4l4 4-4 4" },
  check: { viewBox: "0 0 18 18", d: "M3 9.5l4 4L15 5" },
} as const;

export type IconName = keyof typeof paths;

type IconProps = {
  name: IconName;
  size?: "sm" | "md";
  className?: string;
};

/** Stroke icons that inherit the current text colour. Decorative by default. */
export function Icon({ name, size = "md", className }: IconProps) {
  const { viewBox, d } = paths[name];
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden="true"
      className={cx(styles.icon, styles[`size-${size}`], className)}
    >
      <path d={d} />
    </svg>
  );
}
