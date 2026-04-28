import { useState } from "react";
import type { T } from "../../i18n";
import { handleLinkClick } from "../../hooks/useRoute";

type Props = {
  t: T;
  onConstructionClick?: () => void;
};

export function Navbar({ t, onConstructionClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.uvod },
    { href: "/rezervace", label: t.nav.rezervace },
    { href: "/kontakt", label: t.nav.kontakt },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Hlavní navigace">
      <div className="navbar__inner">
        <a href="/" className="navbar__brand" onClick={handleLinkClick}>
          {t.nav.brandAlt}
        </a>

        <button
          className={`navbar__toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={t.nav.menu}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar__links ${menuOpen ? "is-open" : ""}`}>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => {
                  if (l.href === "/rezervace" && onConstructionClick) {
                    e.preventDefault();
                    onConstructionClick();
                    return;
                  }
                  handleLinkClick(e);
                  setMenuOpen(false);
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
