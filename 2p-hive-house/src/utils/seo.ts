import type { BreadcrumbItem, SeoMeta } from "../types";

/**
 * Aktualizuje <title> a meta/link tagy pro SEO dynamicky.
 * Používá se z komponenty SEOHead pro každou stránku/sekci.
 *
 * Pokrývá:
 *  - <title>
 *  - description + keywords
 *  - Open Graph (title, description, image, url, type)
 *  - Twitter Card (title, description, image)
 *  - canonical URL
 *  - JSON-LD BreadcrumbList (pokud je meta.breadcrumbs vyplněné)
 */
export function applySeo(meta: SeoMeta) {
  if (typeof document === "undefined") return;

  document.title = meta.title;

  setMeta("name", "description", meta.description);
  if (meta.keywords) setMeta("name", "keywords", meta.keywords);

  // Open Graph
  setMeta("property", "og:title", meta.title);
  setMeta("property", "og:description", meta.description);
  if (meta.ogImage) setMeta("property", "og:image", absolute(meta.ogImage));
  if (meta.canonical) setMeta("property", "og:url", meta.canonical);

  // Twitter
  setMeta("name", "twitter:title", meta.title);
  setMeta("name", "twitter:description", meta.description);
  if (meta.ogImage) setMeta("name", "twitter:image", absolute(meta.ogImage));

  // Canonical
  if (meta.canonical) setLink("canonical", meta.canonical);

  // BreadcrumbList JSON-LD
  applyBreadcrumbs(meta.breadcrumbs);
}

function absolute(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (typeof window === "undefined") return url;
  return new URL(url, window.location.origin).toString();
}

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const BREADCRUMB_ID = "ld-breadcrumb";

/**
 * Injektuje (nebo smaže) JSON-LD BreadcrumbList do <head>.
 * ID skriptu je stabilní — druhá a další volání přepíšou existující.
 *
 * Breadcrumbs jako [{name, url?}] — poslední položka bez url představuje
 * aktuální stránku (v souladu se schema.org/BreadcrumbList doporučením).
 */
function applyBreadcrumbs(breadcrumbs?: BreadcrumbItem[]) {
  const existing = document.getElementById(BREADCRUMB_ID);

  if (!breadcrumbs || breadcrumbs.length === 0) {
    if (existing) existing.remove();
    return;
  }

  const payload = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      ...(b.url ? { item: absolute(b.url) } : {}),
    })),
  };

  const json = JSON.stringify(payload);
  if (existing) {
    existing.textContent = json;
    return;
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = BREADCRUMB_ID;
  script.textContent = json;
  document.head.appendChild(script);
}
