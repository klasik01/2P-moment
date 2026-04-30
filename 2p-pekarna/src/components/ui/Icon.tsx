import type { ReactNode, SVGProps } from "react";

type IconName =
  | "check"
  | "bed"
  | "layout"
  | "bath"
  | "castle"
  | "mountain"
  | "town"
  | "diamond"
  | "wave"
  | "monument"
  | "arrow-right"
  | "close"
  | "chevron-left"
  | "chevron-right";

type Props = {
  name: IconName | string;
  className?: string;
  size?: number;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, "name">;

/**
 * Inline SVG ikony. Stroke-based (currentColor), 24×24 viewBox.
 * Pro přidání nové ikony stačí rozšířit `paths` níže.
 */
export function Icon({
  name,
  className = "",
  size = 24,
  title,
  ...rest
}: Props) {
  const path = paths[name as IconName];
  if (!path) {
    return (
      <span
        className={`icon icon-${name} ${className}`}
        style={{ width: size, height: size, display: "inline-block" }}
        aria-hidden="true"
      />
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon icon-${name} ${className}`}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  );
}

const paths: Record<IconName, ReactNode> = {
  check:        <path d="M5 13l4 4L19 7" />,
  bed:          <path d="M3 18v-6a4 4 0 014-4h10a4 4 0 014 4v6M3 18h18M7 10V6m10 4V6" />,
  layout: (
    <>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a2 2 0 012-2h6a2 2 0 012 2v4" />
    </>
  ),
  bath: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  castle:       <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />,
  mountain: (
    <>
      <path d="M2 20l5-9 4 6 3-5 8 8H2z" />
      <circle cx="17" cy="6" r="2" />
    </>
  ),
  town:         <path d="M12 2v20M5 9l7-7 7 7M3 22h18" />,
  diamond: (
    <>
      <path d="M3 12l9-9 9 9-9 9z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  wave:         <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 6c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />,
  monument: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="1" />
      <path d="M3 7l9-5 9 5M9 20v-6h6v6" />
    </>
  ),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  close:         <path d="M6 6l12 12M18 6L6 18" />,
  "chevron-left":  <path d="M15 18l-6-6 6-6" />,
  "chevron-right": <path d="M9 6l6 6-6 6" />,
};
