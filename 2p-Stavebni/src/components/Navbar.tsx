import { useEffect, useMemo, useState } from "react";
import { t } from "../i18n";
import type { NavItem } from "../types/content";
import { Icon } from "./Icon";

type NavbarProps = {
  companyName: string;
  logo: string;
  navigation: NavItem[];
};

/** Pulls the section id out of a hash href (#uvod → uvod). Empty for non-hash or non-section targets. */
function sectionIdFromHref(href: string): string | null {
  if (!href.startsWith("#") || href.startsWith("#/")) return null;
  const id = href.slice(1);
  return id.length > 0 ? id : null;
}

export function Navbar({ companyName, logo, navigation }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  /** Map section id -> href, derived from navigation so data drives behavior. */
  const sectionToHref = useMemo(() => {
    const map = new Map<string, string>();
    navigation.forEach((item) => {
      const id = sectionIdFromHref(item.href);
      if (id) map.set(id, item.href);
    });
    return map;
  }, [navigation]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: highlight the section currently crossing the viewport center.
  useEffect(() => {
    if (sectionToHref.size === 0) return undefined;

    const elements = Array.from(sectionToHref.keys())
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return undefined;

    // Track the most-visible section across observer callbacks.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });

        let bestId: string | null = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId && bestRatio > 0) {
          const href = sectionToHref.get(bestId) ?? null;
          setActiveHref(href);
        }
      },
      {
        // Make the observer sensitive to the middle ~40 % of the viewport.
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));

    // Sync with hash on mount (e.g. when opening a deep link).
    const initialHash = window.location.hash;
    if (initialHash && sectionToHref.has(initialHash.slice(1))) {
      setActiveHref(initialHash);
    }

    return () => observer.disconnect();
  }, [sectionToHref]);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} id="navbar">
      <div className="container">
        <div className="navbar-inner">
          <a href="#uvod" className="navbar-logo" onClick={() => setIsOpen(false)}>
            <img
              src={logo}
              alt={companyName}
              onError={(event) => {
                (event.currentTarget as HTMLImageElement).style.display = "none";
                const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "block";
              }}
            />
            <span className="logo-fallback">
              {t("brand.short")} <span>{t("brand.suffix")}</span>
            </span>
          </a>
          <ul className={`navbar-nav ${isOpen ? "open" : ""}`} id="nav-menu">
            {navigation.map((item) => {
              const isActive = activeHref === item.href;
              const classNames = [
                item.isButton ? "navbar-cta" : null,
                isActive ? "active" : null,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={classNames || undefined}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <button
            className="hamburger"
            type="button"
            aria-label={t("nav.menuAria")}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>
    </nav>
  );
}
