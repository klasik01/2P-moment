import type { FaqContent } from "../../../types/content";
import { faq as faqItems } from "../../seo/faq";

/**
 * Viditelná FAQ sekce na homepage. Items (otázky a odpovědi) zdílí
 * zdroj s FAQPage JSON-LD schema v `data/seo/faq.ts`, aby byl obsah
 * viditelný ↔ markup 1:1 shodný (Google tuto shodu vyžaduje, jinak
 * FAQ rich result nezobrazí).
 */
export const faq: FaqContent = {
  label: "Časté dotazy",
  title: "Jaké máme",
  titleAccent: "odpovědi?",
  description:
    "Nejčastější otázky investorů, které nám přicházejí před zahájením projektu. Odpovědi jsou konkrétní a vycházejí z naší praxe v Kraji Vysočina.",
  items: faqItems,
};
