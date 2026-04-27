// =============================================================
// Icon — jednoduchá knihovna line SVG ikon (stroke 1.6).
// Použití: <Icon name="lungs" />
//
// Ikony jsou navržené tak, aby seděly k medové paletě
// (currentColor → barvu nastavujeme v CSS rodičovi).
// Když se přidává nová ikona, stačí dopsat klíč do mapy ICONS.
// =============================================================

type IconName =
  | "home"
  | "shield"
  | "sparkles"
  | "lungs"
  | "moon"
  | "leaf"
  | "shield-check"
  | "heartbeat"
  | "brain"
  | "calendar"
  | "envelope"
  | "trees"
  | "bee"
  | "facebook"
  | "instagram"
  | "phone"
  | "mail"
  | "map-pin"
  | "clock";

type Props = {
  name: IconName | string;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.5 3 8 7 9 4-1 7-4.5 7-9V6l-7-3Z" />
      <path d="M9 12.5l2 2 4-4.5" />
    </>
  ),
  "shield-check": (
    <>
      <path d="M12 3 5 6v6c0 4.5 3 8 7 9 4-1 7-4.5 7-9V6l-7-3Z" />
      <path d="M9 12.5l2 2 4-4.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8" />
    </>
  ),
  lungs: (
    <>
      <path d="M12 3v10" />
      <path d="M9 7c0 0-3 1-4 4-1.4 4 0 9 3 9 1.7 0 3-1.3 3-3V8" />
      <path d="M15 7c0 0 3 1 4 4 1.4 4 0 9-3 9-1.7 0-3-1.3-3-3V8" />
    </>
  ),
  moon: (
    <>
      <path d="M21 13a8.5 8.5 0 0 1-10-10 8.5 8.5 0 1 0 10 10Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-9 7-15 16-14 1 9-5 16-14 16-1 0-2 0-2-1Z" />
      <path d="M5 19 14 10" />
    </>
  ),
  heartbeat: (
    <>
      <path d="M3 12h4l2-4 3 8 2-4h7" />
      <path d="M12 21s-7-4-9-9.5C1.4 7 4 3 8 3c2 0 3 1 4 2 1-1 2-2 4-2 4 0 6.6 4 5 8.5C19 17 12 21 12 21Z" />
    </>
  ),
  brain: (
    <>
      <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3 3 3 0 0 0 2 3v2a3 3 0 0 0 6 0V4a3 3 0 0 0-3 0Z" />
      <path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 3 3 3 0 0 1-2 3v2a3 3 0 0 1-6 0V4a3 3 0 0 1 3 0Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  envelope: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </>
  ),
  trees: (
    <>
      <path d="M12 3 7 10h3l-4 6h12l-4-6h3Z" />
      <path d="M12 16v5" />
    </>
  ),
  bee: (
    <>
      <ellipse cx="12" cy="14" rx="5" ry="6" />
      <path d="M7 12h10M7 16h10" />
      <path d="M9 8c-3-2-6-1-6-1s2 3 5 3M15 8c3-2 6-1 6-1s-2 3-5 3" />
    </>
  ),

  // --- Sociální sítě (filled-ish line style) ---
  facebook: (
    <path
      d="M14 9h3V5.5h-3c-2.2 0-4 1.8-4 4V12H7v3h3v7h3v-7h3l1-3h-4V9.5c0-.3.2-.5.5-.5H14Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),

  // --- Kontakty ---
  phone: (
    <path d="M5 4h3l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
};

export function Icon({ name, size = 24, className, strokeWidth = 1.6 }: Props) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
