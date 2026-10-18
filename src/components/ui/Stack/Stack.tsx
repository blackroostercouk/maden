import type { CSSProperties, ElementType, ReactNode } from "react";
import type { SpaceToken } from "@/design/tokens";
import { space } from "@/design/tokens";
import { cx } from "@/lib/cx";
import styles from "./Stack.module.css";

type StackProps = {
  as?: ElementType;
  gap?: SpaceToken;
  align?: "start" | "center" | "end" | "stretch";
  /** Lay children out in a row that wraps instead of a column. */
  direction?: "column" | "row";
  className?: string;
  children: ReactNode;
} & Record<`data-${string}`, string | undefined>;

/** Vertical (or wrapping row) group with a token gap. */
export function Stack({
  as: Tag = "div",
  gap = "6",
  align = "stretch",
  direction = "column",
  className,
  children,
  ...data
}: StackProps) {
  return (
    <Tag
      className={cx(styles.stack, styles[direction], styles[`align-${align}`], className)}
      style={{ "--stack-gap": space(gap) } as CSSProperties}
      {...data}
    >
      {children}
    </Tag>
  );
}
