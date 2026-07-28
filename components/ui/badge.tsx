import type { HTMLAttributes, ReactNode } from "react";
import styles from "./badge.module.css";

export type BadgeVariant =
  | "verified"
  | "condition"
  | "neutral"
  | "success"
  | "warning";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

export function Badge({
  children,
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  const classes = [styles.badge, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
