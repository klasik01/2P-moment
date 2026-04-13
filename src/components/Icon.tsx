type IconProps = {
  name: string;
  size?: number;
  strokeWidth?: number;
  filled?: boolean;
};

export function Icon({ name, size = 24, strokeWidth = 2, filled = false }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: filled ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth,
  };

  switch (name) {
    case "menu":
      return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
    case "check":
      return <svg {...common}><polyline points="20 6 9 17 4 12" /></svg>;
    case "house":
      return <svg {...common}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
    case "screen":
      return <svg {...common}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
    case "grid":
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M3 9h6M3 15h6" /></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
    case "users":
      return <svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "phone":
      return <svg {...common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 2 .84h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
    case "mail":
      return <svg {...common}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></svg>;
    case "arrow-right":
      return <svg {...common}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
    case "send":
      return <svg {...common}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
    case "pin":
      return <svg {...common}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "company":
      return <svg {...common}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
    case "building":
      return <svg {...common}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
    case "facebook":
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;
    case "instagram":
      return <svg {...common}><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;
    case "close":
      return <svg {...common}><path d="M18 6 6 18M6 6l12 12" /></svg>;
    case "chevron-left":
      return <svg {...common}><polyline points="15 18 9 12 15 6" /></svg>;
    case "chevron-right":
      return <svg {...common}><polyline points="9 18 15 12 9 6" /></svg>;
    case "chevron-up":
      return <svg {...common}><polyline points="18 15 12 9 6 15" /></svg>;
    case "chevron-down":
      return <svg {...common}><polyline points="6 9 12 15 18 9" /></svg>;
    case "eye":
      return <svg {...common}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "eye-off":
      return <svg {...common}><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a21.78 21.78 0 0 1 5.06-5.94M9.9 4.24A10.93 10.93 0 0 1 12 5c7 0 11 7 11 7a21.66 21.66 0 0 1-2.16 3.19M1 1l22 22" /><path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" /></svg>;
    case "star":
      return <svg {...common}><path d="m12 3 2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.77 6.2 20.87l1.11-6.47-4.7-4.58 6.49-.94z" /></svg>;
    case "trash":
      return <svg {...common}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /></svg>;
    case "upload":
      return <svg {...common}><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" /><path d="M8 20h8" /></svg>;
    case "image":
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="m21 15-4.5-4.5L8 19" /></svg>;
    case "scroll":
      return <svg {...common}><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>;
    default:
      return null;
  }
}
