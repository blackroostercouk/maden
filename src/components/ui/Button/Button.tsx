import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "../Icon";
import styles from "./Button.module.css";

type ButtonStyleProps = {
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  /** Show a trailing arrow that nudges on hover. */
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
};

type LinkProps = ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonStyleProps> & { href: string };

type NativeButtonProps = ButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonStyleProps> & { href?: never };

export type ButtonProps = LinkProps | NativeButtonProps;

/** One button style for links and buttons alike. Pass `href` to render a link. */
export function Button({
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cx(styles.button, styles[variant], styles[`size-${size}`], className);
  const content = (
    <>
      <span>{children}</span>
      {withArrow && <Icon name="arrowRight" size="sm" className={styles.arrow} />}
    </>
  );

  if (typeof rest.href === "string") {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
