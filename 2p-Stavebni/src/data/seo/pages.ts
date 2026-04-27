import { DEFAULT_LOCALE, DEFAULT_OG_IMAGE, SITE_URL } from "./defaults";

/**
 * Per-page SEO metadata. A single source of truth for every page the app
 * might render. Today the public site has one canonical URL (the home page);
 * the structure is ready for future pages (blog, service detail, FAQ…).
 */
export type PageSeo = {
  /** Route key used to pick the right config. */
  id: string;
  /** Path relative to the site origin – used for canonical / OG URL. */
  path: string;
  /** 50–60 chars, contains primary keyword + brand. */
  title: string;
  /** 150–160 chars, ends with a natural CTA. */
  description: string;
  /** Absolute URL – at least 1200×630. */
  ogImage: string;
  /** OG locale, e.g. `cs_CZ`. */
  locale: string;
  /** Keywords used in structured data + legacy meta keywords. */
  keywords: string[];
  /** Indexing directive; default `index, follow`. */
  robots?: string;
};

export const pagesSeo: Record<string, PageSeo> = {
  home: {
    id: "home",
    path: "/",
    title: "2P Stavební | Realizace staveb a rekonstrukce v Pacově",
    description:
      "Realizace staveb, rekonstrukce, výplně otvorů a požární ucpávky v Pacově a celém Kraji Vysočina. Elektronický stavební deník 24/7. Volejte 605 075 324.",
    ogImage: DEFAULT_OG_IMAGE,
    locale: DEFAULT_LOCALE,
    keywords: [
      "stavební firma Pacov",
      "realizace staveb",
      "rekonstrukce",
      "zateplení fasád",
      "výplně otvorů",
      "stavební dozor",
      "protipožární ucpávky",
      "elektronický stavební deník",
      "2P Stavební",
    ],
  },
};

/** Resolve absolute canonical URL for a given page. */
export function canonicalUrl(page: PageSeo): string {
  return `${SITE_URL}${page.path === "/" ? "/" : page.path}`;
}
