import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import styles from "./button.module.css";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "default" | "large";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

type LinkButtonProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    disabled?: boolean;
  };

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button({
  children,
  className,
  variant = "primary",
  size = "default",
  fullWidth = false,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size === "large" ? styles.large : "",
    fullWidth ? styles.fullWidth : "",
    "disabled" in props && props.disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const { href, disabled, ...linkProps } = props as LinkButtonProps;
    return (
      <Link
        href={href}
        className={classes}
        suppressHydrationWarning
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : linkProps.tabIndex}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const buttonProps = props as NativeButtonProps;

  return (
    <button className={classes} suppressHydrationWarning {...buttonProps}>
      {children}
    </button>
  );
}
