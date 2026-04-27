import { useEffect, useState } from "react";
import type { T } from "../../i18n";
import { asset } from "../../utils/asset";
import { useRoute, handleLinkClick } from "../../hooks/useRoute";
import { isActive as profileActive } from "../../config/profiles";

type Props = {
  t: T;
  onVoucherClick: () => void;
  onReservationClick?: () => void;
};

/**
 * Navigace.
 * Každý odkaz má "match" — přesný route match (/rezervace, /kontakt, /fishing).
 * Podle aktuální routy (useRoute) se u odpovídajícího odkazu aplikuje class
 * "is-active". Kliky jsou interceptované přes handleLinkClick (pushState).
 */
const navLinks: { key: keyof T["nav"]; href: string; match: "/" | "/rezervace" | "/kontakt" | "/fishing" }[] = [
  { key: "vcelin", href: "/", match: "/" },
  { key: "fishing", href: "/fishing", match: "/fishing" },
  { key: "rezervace", href: "/rezervace", match: "/rezervace" },
  { key: "kontakt", href: "/kontakt", match: "/kontakt" },
];

export function Navbar({ t, onVoucherClick, onReservationClick }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const route = useRoute();
  const underConstruction = profileActive("VE_VYSTAVBE");

  // Ve výstavbě skryjeme odkaz na rezervaci z navigace
  const visibleLinks = underConstruction
    ? navLinks.filter((l) => l.match !== "/rezervace")
    : navLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open", mobileOpen);
  }, [mobileOpen]);

  // Zavírá mobilní menu po kliknutí na odkaz nebo změně routy.
  const close = () => setMobileOpen(false);
  useEffect(() => { close(); }, [route]);

  const isActive = (match: string) => route === match;

  /**
   * Klik intercept přes handleLinkClick (pushState). Zároveň zavře mobilní menu.
   */
  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    close();
    handleLinkClick(e);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`} aria-label="Hlavní navigace">
        <div className="container">
          <div className="navbar-inner">
            <a href="/" className="navbar-brand" onClick={onNavClick} aria-label={t.nav.brandAlt}>
              <span className="navbar-logo-badge">
                <img src={asset("/logo.png")} alt={t.nav.brandAlt} className="navbar-logo" />
              </span>
            </a>

            <ul className="navbar-nav">
              {visibleLinks.map(({ key, href, match }) => (
                <li key={key}>
                  <a
                    href={href}
                    onClick={onNavClick}
                    className={isActive(match) ? "is-active" : undefined}
                    aria-current={isActive(match) ? "page" : undefined}
                  >
                    {t.nav[key]}
                  </a>
                </li>
              ))}
            </ul>

            <div className="navbar-actions">
              <button className="btn btn-outline-honey navbar-voucher" onClick={onVoucherClick}>
                {t.nav.poukazka}
              </button>
              {underConstruction && onReservationClick ? (
                <button className="btn btn-primary navbar-cta" onClick={onReservationClick}>
                  {t.nav.rezervace}
                </button>
              ) : (
                <a href="/rezervace" className="btn btn-primary navbar-cta" onClick={onNavClick}>
                  {t.nav.rezervace}
                </a>
              )}
              <button
                className={`navbar-hamburger${mobileOpen ? " open" : ""}`}
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={t.nav.menu}
                aria-expanded={mobileOpen}
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`navbar-mobile${mobileOpen ? " open" : ""}`}>
        <button
          type="button"
          className="navbar-mobile-close"
          onClick={close}
          aria-label={t.common.close}
        >
          ✕
        </button>

        {visibleLinks.map(({ key, href, match }) => (
          <a
            key={key}
            href={href}
            onClick={onNavClick}
            className={isActive(match) ? "is-active" : undefined}
            aria-current={isActive(match) ? "page" : undefined}
          >
            {t.nav[key]}
          </a>
        ))}
        <div className="mobile-actions">
          <button
            className="btn btn-outline-honey"
            onClick={() => { onVoucherClick(); close(); }}
          >
            {t.nav.poukazka}
          </button>
          {underConstruction && onReservationClick ? (
            <button className="btn btn-primary" onClick={() => { onReservationClick(); close(); }}>
              {t.nav.rezervace}
            </button>
          ) : (
            <a href="/rezervace" className="btn btn-primary" onClick={onNavClick}>
              {t.nav.rezervace}
            </a>
          )}
        </div>
      </div>
    </>
  );
}
