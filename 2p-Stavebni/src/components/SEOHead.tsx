import { useEffect } from "react";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_LOCALE,
  DEFAULT_TWITTER_CARD,
  SITE_AUTHOR,
  canonicalUrl,
  homeJsonLdBlocks,
  pagesSeo,
  type PageSeo,
} from "../data/seo";

type SEOHeadProps = {
  /** Page id matching `pagesSeo` key, e.g. "home". Defaults to home. */
  pageId?: keyof typeof pagesSeo;
};

/**
 * Head manager – imperatively keeps `<head>` in sync with the active page's
 * SEO configuration. Handles title, description, robots, canonical,
 * OpenGraph, Twitter card, keywords, lang, and a set of JSON-LD blocks.
 *
 * Everything it writes is annotated with `data-seo="managed"` so we can
 * safely remove stale tags between renders without touching tags authored
 * in `index.html`.
 */
export function SEOHead({ pageId = "home" }: SEOHeadProps) {
  useEffect(() => {
    const page: PageSeo = pagesSeo[pageId] ?? pagesSeo.home;
    const url = canonicalUrl(page);

    // Document title + html lang
    document.title = page.title;
    document.documentElement.lang = DEFAULT_LANGUAGE;

    // Helpers --------------------------------------------------------------
    const remove = (selector: string) => {
      document.querySelectorAll(selector).forEach((node) => node.remove());
    };

    const setMeta = (
      attr: "name" | "property",
      key: string,
      content: string,
    ) => {
      let tag = document.head.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`,
      );
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        tag.dataset.seo = "managed";
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string, extra: Record<string, string> = {}) => {
      let tag = document.head.querySelector<HTMLLinkElement>(
        `link[rel="${rel}"]`,
      );
      if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", rel);
        tag.dataset.seo = "managed";
        document.head.appendChild(tag);
      }
      tag.setAttribute("href", href);
      Object.entries(extra).forEach(([k, v]) => tag!.setAttribute(k, v));
    };

    // Basic meta -----------------------------------------------------------
    setMeta("name", "description", page.description);
    setMeta("name", "keywords", page.keywords.join(", "));
    setMeta("name", "author", SITE_AUTHOR);
    setMeta("name", "robots", page.robots ?? "index, follow");
    setMeta("name", "theme-color", "#eb1c24");

    // Canonical ------------------------------------------------------------
    setLink("canonical", url);

    // OpenGraph ------------------------------------------------------------
    setMeta("property", "og:type", "website");
    setMeta("property", "og:locale", page.locale ?? DEFAULT_LOCALE);
    setMeta("property", "og:site_name", SITE_AUTHOR);
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", page.description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", page.ogImage);
    setMeta("property", "og:image:alt", page.title);
    setMeta("property", "og:image:width", "512");
    setMeta("property", "og:image:height", "512");

    // Twitter --------------------------------------------------------------
    setMeta("name", "twitter:card", DEFAULT_TWITTER_CARD);
    setMeta("name", "twitter:title", page.title);
    setMeta("name", "twitter:description", page.description);
    setMeta("name", "twitter:image", page.ogImage);
    setMeta("name", "twitter:image:alt", page.title);

    // JSON-LD --------------------------------------------------------------
    remove('script[data-seo="jsonld"]');
    const blocks =
      pageId === "home" ? homeJsonLdBlocks(page.title, page.description) : [];
    blocks.forEach((block) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seo = "jsonld";
      script.text = JSON.stringify(block);
      document.head.appendChild(script);
    });
  }, [pageId]);

  return null;
}
