import { useEffect, useState } from "react";
import type { Translations } from "../../i18n";
import { handleLinkClick, useRoute } from "../../hooks/useRoute";
import { Button } from "../ui/Button";

type Props = {
  t: Translations;
};

type NavLink = {
  href: string;
  label: string;
};

export function Navbar({ t }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const route = useRoute();
  const isHome = route === "/";

  const links: NavLink[] = [
    { href: "/",                  label: t.nav.home },
    { href: "/ubytovani",         label: t.nav.accommodation },
    { href: "/komercni-prostory", label: t.nav.commercial },
    { href: "/o-pekarne",         label: t.nav.about },
    { href: "/kontakt",           label: t.nav.contact },
  ];

  // Na úvodní stránce hlavička leží průhledně na hero fotce a zpevní
  // se až po odscrollování. Na podstránkách je pevná hned.
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Zavři mobilní menu při změně cesty.
  useEffect(() => { setMenuOpen(false); }, [route]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isOver = isHome && !scrolled && !menuOpen;

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleLinkClick(e);
    setMenuOpen(false);
  };

  const renderNavItems = (isMobile: boolean) => (
    <>
      {links.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            aria-current={route === l.href ? "page" : undefined}
            onClick={onLinkClick}
          >
            {l.label}
          </a>
        </li>
      ))}
      <li>
        <Button
          href="/rezervace"
          size={isMobile ? "md" : "sm"}
          block={isMobile}
          onClick={() => setMenuOpen(false)}
        >
          {t.nav.reserve}
        </Button>
      </li>
    </>
  );

  return (
    <header className={`navbar${isOver ? " navbar--over" : ""}`} role="banner">
      <div className="container navbar__inner">
        <a
          href="/"
          className="navbar__brand"
          onClick={handleLinkClick}
          aria-label={`${t.nav.brandAlt} — ${t.nav.home}`}
        >
          <span className="navbar__brand-mark" aria-hidden="true">2P</span>
          <span>Pekárna</span>
        </a>

        <nav className="navbar__nav" aria-label={t.nav.menu}>
          <ul className="navbar__links">{renderNavItems(false)}</ul>
        </nav>

        <button
          type="button"
          className={`navbar__toggle${menuOpen ? " is-open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.menu}
          aria-expanded={menuOpen}
          aria-controls="navbar-mobile"
        >
          <span aria-hidden="true" />
        </button>
      </div>

      {/* Mobilní menu — mimo container, aby šlo přes celou šířku. */}
      {menuOpen ? (
        <nav id="navbar-mobile" className="navbar__mobile" aria-label={t.nav.menu}>
          <ul>{renderNavItems(true)}</ul>
        </nav>
      ) : null}
    </header>
  );
}
