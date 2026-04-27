// ============================================================
// Konfigurace stránky RYBAŘENÍ — data se načítají z fishing.json.
// ============================================================

import raw from "../data/fishing.json";

export type FishingPageConfig = {
  seo: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    ogImage: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    image: string;
    imageAlt: string;
  };
  info: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    cards: { id: string; icon: string; title: string; text: string }[];
  };
  cta: {
    eyebrow: string;
    title: string;
    desc: string;
    buttonLabel: string;
  };
};

export const fishingPage: FishingPageConfig = raw as FishingPageConfig;
