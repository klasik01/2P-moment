import { useEffect, useState } from "react";
import type { T } from "../../i18n";
import { handleLinkClick, useRoute } from "../../hooks/useRoute";

type Props = {
  t: T;
};

type NavLink = {
  href: string;
  label: string;
  isCta?: boolean;
};

export function Navbar({ t }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const route = useRoute();

  const links: NavLink[] = [
    { href: "/",                  label: t.nav.home },
    { href: "/ubytovani",         label: t.nav.accommodation },
    { href: "/komercni-prostory", label: t.nav.commercial },
    { href: "/o-pekarne",         label: t.nav.about },
    { href: "/kontakt",           label: t.nav.contact },
    { href: "/rezervace",         label: t.nav.reserve, isCta: true },
  ];

  // Zavři mobilní menu při změně cesty.
  useEffect(() => { setMenuOpen(false); }, [route]);

  // Zavři mobilní menu při ESC.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleLinkClick(e);
    setMenuOpen(false);
  };

  const renderLinks = () =>
    links.map((l) => (
      <li key={l.href}>
        <a
          href={l.href}
          className={l.isCta ? "navbar__cta" : ""}
          aria-current={route === l.href ? "page" : undefined}
          onClick={onLinkClick}
        >
          {l.label}
        </a>
      </li>
    ));

  return (
    <header className="navbar" role="banner">
      <div className="container navbar__inner">
        <a
          href="/"
          className="navbar__brand"
          onClick={handleLinkClick}
          aria-label={`${t.nav.brandAlt} — ${t.nav.home}`}
        >
          <span className="navbar__brand-mark" aria-hidden="true">2P</span>
          <span className="navbar__brand-text">Pekárna</span>
        </a>

        <nav className="navbar__nav" aria-label={t.nav.menu}>
          <ul className={`navbar__links ${menuOpen ? "is-open" : ""}`}>
            {renderLinks()}
          </ul>
        </nav>

        <button
          type="button"
          className={`navbar__toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.menu}
          aria-expanded={menuOpen}
          aria-controls="navbar-mobile"
        >
          <span aria-hidden="true" />
        </button>
      </div>

      {/* Mobilní menu — render mimo container (full-bleed). */}
      <div
        id="navbar-mobile"
        className={`navbar__mobile ${menuOpen ? "is-open" : ""}`}
        hidden={!menuOpen}
      >
        <ul>{renderLinks()}</ul>
      </div>
    </header>
  );
}
