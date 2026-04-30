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
  const isHome = route === "/";

  // Na úvodní stránce ukazujeme in-page kotvy, jinde routy.
  const links: NavLink[] = isHome
    ? [
        { href: "#o-pekarne", label: t.nav.about },
        { href: "#apartmany", label: t.nav.apartments },
        { href: "#galerie",   label: t.nav.gallery },
        { href: "#okoli",     label: t.nav.nearby },
        { href: "#poptavka",  label: t.nav.inquiry, isCta: true },
      ]
    : [
        { href: "/",          label: t.nav.home },
        { href: "/rezervace", label: t.nav.rezervace },
        { href: "/kontakt",   label: t.nav.kontakt },
      ];

  // Zavři mobilní menu při změně cesty / kotvy.
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
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={l.isCta ? "navbar__cta" : ""}
                  onClick={onLinkClick}
                >
                  {l.label}
                </a>
              </li>
            ))}
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
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={l.isCta ? "navbar__cta" : ""}
                onClick={onLinkClick}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
