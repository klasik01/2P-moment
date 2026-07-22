import type { ReactNode, MouseEvent } from "react";
import { handleLinkClick } from "../../hooks/useRoute";

export type ButtonVariant = "primary" | "ghost" | "inverse" | "link";
export type ButtonSize = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  /** Když je vyplněné, renderuje se <a>. Jinak <button>. */
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Přes celou šířku rodiče — mobilní menu, formuláře. */
  block?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
};

/**
 * Jediné tlačítko v projektu. Odsazení a tvar se mění v
 * styles/components/_button.scss — nikde jinde tlačítko nepřepisuj.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  block = false,
  type = "button",
  disabled = false,
  className = "",
  onClick,
  ...rest
}: Props) {
  const classes = [
    "btn",
    `btn--${variant}`,
    size !== "md" ? `btn--${size}` : "",
    block ? "btn--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabled || undefined}
        onClick={(e) => {
          onClick?.(e);
          handleLinkClick(e as MouseEvent<HTMLAnchorElement>);
        }}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
