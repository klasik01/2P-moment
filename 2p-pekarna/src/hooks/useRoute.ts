import { useEffect, useState } from "react";

/**
 * Path-based router (History API).
 *
 * Formát URL:
 *   /                       -> route "/"
 *   /rezervace              -> route "/rezervace"
 *   /kontakt                -> route "/kontakt"
 */

function migrateLegacyHashIfNeeded() {
  if (typeof window === "undefined") return;
  const h = window.location.hash;
  if (!h || !h.startsWith("#/")) return;

  const rest = h.slice(2);
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
    window.addEventListener("pekarna:navigate", onChange as EventListener);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("pekarna:navigate", onChange as EventListener);
    };
  }, []);

  return route;
}

/**
 * Programová navigace — pushState + custom event pro rerender.
 */
export function navigate(href: string) {
  if (typeof window === "undefined") return;

  if (/^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) {
    window.location.href = href;
    return;
  }

  if (href.startsWith("#")) {
    const id = href.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const [pathPart, anchorPart] = href.split("#");
  const target = pathPart || "/";
  const anchor = anchorPart ? "#" + anchorPart : "";

  if (currentPath() === target) {
    if (anchor) {
      const el = document.getElementById(anchorPart);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }

  window.history.pushState({}, "", target + anchor);
  window.dispatchEvent(new Event("pekarna:navigate"));
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
 * Click handler pro <a> tagy, který respektuje modifikační klávesy.
 */
export function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
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

  if (a.target && a.target !== "" && a.target !== "_self") return;
  if (a.hasAttribute("download")) return;

  if (/^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) return;

  e.preventDefault();
  navigate(href);
}
