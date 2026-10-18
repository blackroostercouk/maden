import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./MockHeader.module.css";

type MockHeaderProps = {
  /** kicker: small grey caption with an optional status dot. app: bold title with an app icon. */
  variant?: "kicker" | "app";
  dot?: boolean;
  /** Letter shown in the app icon. */
  appInitial?: string;
  /** Element on the right, usually a Pill. */
  trailing?: ReactNode;
  children: ReactNode;
};

export function MockHeader({
  variant = "kicker",
  dot = false,
  appInitial = "S",
  trailing,
  children,
}: MockHeaderProps) {
  return (
    <p className={cx(styles.header, styles[variant])}>
      {variant === "app" && <span className={styles.appIcon}>{appInitial}</span>}
      {variant === "kicker" && dot && <span className={styles.dot} />}
      <span>{children}</span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </p>
  );
}
