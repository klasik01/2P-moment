import { useEffect } from "react";
import type { SeoMeta } from "../../types";
import { media } from "../../services/media";

type Props = { meta: SeoMeta };

/** Přepisuje meta tagy podle aktuální stránky. */
export function SEOHead({ meta }: Props) {
  useEffect(() => {
    document.title = meta.title;

    const upsert = (selector: string, create: () => Element, attr: string, value?: string) => {
      if (!value) return;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    const named = (name: string, content?: string) =>
      upsert(`meta[name="${name}"]`, () => {
        const el = document.createElement("meta");
        el.setAttribute("name", name);
        return el;
      }, "content", content);

    const property = (prop: string, content?: string) =>
      upsert(`meta[property="${prop}"]`, () => {
        const el = document.createElement("meta");
        el.setAttribute("property", prop);
        return el;
      }, "content", content);

    named("description", meta.description);
    named("keywords", meta.keywords);

    property("og:title", meta.title);
    property("og:description", meta.description);
    property("og:url", meta.canonical);

    const ogImage = meta.ogImageId ? media.getImage(meta.ogImageId) : undefined;
    if (ogImage) {
      // Sdílení potřebuje absolutní URL, relativní cesta nestačí.
      property("og:image", new URL(ogImage.url, window.location.origin).href);
    }

    upsert('link[rel="canonical"]', () => {
      const el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      return el;
    }, "href", meta.canonical);
  }, [meta]);

  return null;
}
