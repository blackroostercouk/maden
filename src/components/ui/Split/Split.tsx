import type { CSSProperties, ElementType, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Split.module.css";

type SplitProps = {
  as?: ElementType;
  /** Column ratio as "left:right" fractions, e.g. "5:6". */
  ratio?: `${number}:${number}`;
  align?: "start" | "center" | "end";
  /** Show the second column first when stacked on small screens. */
  reverseOnStack?: boolean;
  className?: string;
  children: ReactNode;
};

/** Two-column layout that stacks below the md breakpoint. */
export function Split({
  as: Tag = "div",
  ratio = "1:1",
  align = "start",
  reverseOnStack = false,
  className,
  children,
}: SplitProps) {
  const [left, right] = ratio.split(":");
  return (
    <Tag
      className={cx(
        styles.split,
        styles[`align-${align}`],
        reverseOnStack && styles.reverse,
        className,
      )}
      style={{ "--split-left": `${left}fr`, "--split-right": `${right}fr` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
