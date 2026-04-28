import { useEffect, useState } from "react";

/**
 * Path-based router (History API).
 *
 * Formát URL:
 *   /                       -> route "/"
 *   /rezervace              -> route "/rezervace"
 *   /fishing                -> route "/fishing"
 *   /kontakt                -> route "/kontakt"
 *
 * Kotvy v rámci stejné stránky (např. #apiterapie, #vcelin) jsou standardní
 * HTML anchory — řeší je browser, route se nemění.
 *
 * Proč path routing místo hash?
 *   - Vyhledávače indexují každou path-URL jako samostatnou stránku (hash URL
 *     ne — všechno padá na homepage z pohledu crawleru).
 *   - Soulad se sitemap.xml (čisté /rezervace, /fishing, /kontakt).
 *   - Lepší UX, sdílitelné odkazy.
 *
 * Požadavky na hosting:
 *   - Netlify: SPA fallback (`/* → /index.html`) je v netlify.toml. ✅
 *   - GitHub Pages: `public/404.html` obsahuje redirect trik. ✅
 */

// Legacy hash URL (např. sdílený odkaz #/rezervace) dostaneme
// jednorázově migrací na path variantu.
function migrateLegacyHashIfNeeded() {
  if (typeof window === "undefined") return;
  const h = window.location.hash;
  if (!h || !h.startsWith("#/")) return;

  const rest = h.slice(2); // po "#/"
  const [path, anchor] = rest.split("#");
  const target = "/" + (path || "");
  const anchorStr = anchor ? "#" + anchor : "";
  window.history.replaceState({}, "", target + anchorStr);
}

function currentPath(): string {
  if (typeof window === "undefined") return "/";
  const p = window.location.pathname || "/";
  return p === "" ? "/" : p;
}

export function useRoute(): string {
  const [route, setRoute] = useState<string>(() => {
    migrateLegacyHashIfNeeded();
    return currentPath();
  });

  useEffect(() => {
    const onChange = () => {
      const next = currentPath();
      setRoute((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("popstate", onChange);
    window.addEventListener("moment:navigate", onChange as EventListener);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("moment:navigate", onChange as EventListener);
    };
  }, []);

  return route;
}

/**
 * Programová navigace — pushState + custom event pro rerender.
 * Hash anchory (začínající "#") předá browseru (scroll behavior).
 */
export function navigate(href: string) {
  if (typeof window === "undefined") return;

  // Externí URL necháme prohlížeči
  if (/^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) {
    window.location.href = href;
    return;
  }

  // Pure anchor v rámci aktuální stránky — necháme default.
  if (href.startsWith("#")) {
    const id = href.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // Rozdělit na path + optional anchor
  const [pathPart, anchorPart] = href.split("#");
  const target = pathPart || "/";
  const anchor = anchorPart ? "#" + anchorPart : "";

  if (currentPath() === target) {
    // Stejná stránka — jen scroll
    if (anchor) {
      const el = document.getElementById(anchorPart);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }

  window.history.pushState({}, "", target + anchor);
  window.dispatchEvent(new Event("moment:navigate"));
  // Scroll nahoru (nebo na anchor po renderu)
  requestAnimationFrame(() => {
    if (anchorPart) {
      const el = document.getElementById(anchorPart);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

/**
 * Click handler pro <a> tagy, který respektuje modifikační klávesy
 * (cmd/ctrl/shift/alt → nech browser otevřít normálně),
 * externí URL i kotvy. Navigace proběhne přes pushState.
 */
export function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
  // Defaultní browser chování, pokud:
  if (
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  ) return;

  const a = e.currentTarget;
  const href = a.getAttribute("href");
  if (!href) return;

  // target="_blank" nebo download → nech browser
  if (a.target && a.target !== "" && a.target !== "_self") return;
  if (a.hasAttribute("download")) return;

  // Externí URL
  if (/^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) return;

  e.preventDefault();
  navigate(href);
}
