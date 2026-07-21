import type { ReactNode, SVGProps } from "react";

type IconName =
  | "check"
  | "bed"
  | "layout"
  | "bath"
  | "people"
  | "parking"
  | "warehouse"
  | "factory"
  | "office"
  | "phone"
  | "mail"
  | "map"
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
  people: (
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 010 6H9" />
    </>
  ),
  warehouse: (
    <>
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M3 21h18M8 21v-7h8v7" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V11l6 4V11l6 4V7l6 4v10z" />
      <path d="M3 21h18" />
    </>
  ),
  office: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-5h4v5" />
    </>
  ),
  phone:        <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />,
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 6 10-6" />
    </>
  ),
  map: (
    <>
      <path d="M12 21s-7-6.4-7-11a7 7 0 1114 0c0 4.6-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  close:         <path d="M6 6l12 12M18 6L6 18" />,
  "chevron-left":  <path d="M15 18l-6-6 6-6" />,
  "chevron-right": <path d="M9 6l6 6-6 6" />,
};
