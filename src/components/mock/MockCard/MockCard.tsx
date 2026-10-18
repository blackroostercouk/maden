import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./MockCard.module.css";

type MockCardProps = {
  /** Width token: sm 230 · md 300 · lg 340 · xl 380 · full 100% */
  width?: "sm" | "md" | "lg" | "xl" | "full";
  /** Pointer drift strength for the motion layer. Negative drifts the other way. */
  depth?: number;
  /** Rise into place when the parent panel scrolls into view. */
  float?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * A light "app" card used in illustrations. Decorative: the parent
 * should describe the scene with role="img" and an aria-label.
 */
export function MockCard({
  width = "md",
  depth,
  float = false,
  className,
  style,
  children,
}: MockCardProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(styles.card, styles[`width-${width}`], className)}
      style={style}
      data-depth={depth}
      data-float={float || undefined}
    >
      {children}
    </div>
  );
}
