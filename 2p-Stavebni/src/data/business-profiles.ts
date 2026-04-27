/**
 * Veřejné firemní profily, které potvrzují identitu entity "2P Stavební"
 * napříč českým webem a používají se ve schema.org `sameAs` (Organization
 * + LocalBusiness). Každý další autoritativní odkaz posiluje entity graph
 * pro Google Knowledge Graph i pro generativní AI vyhledávače (Perplexity,
 * ChatGPT Search, Google AI Overviews, Gemini).
 *
 * Přidej sem:
 *  - Google Business Profile, jakmile bude ověřený
 *  - LinkedIn firemní stránku, jakmile bude založená
 *  - Jakýkoli další ověřený oborový adresář / rejstřík
 */
export type BusinessProfile = {
  /** Krátký název zdroje (UI-friendly, pro case studies / footer / reporty). */
  label: string;
  /** Kanonická URL profilu. */
  href: string;
};

export const businessProfiles: BusinessProfile[] = [
  {
    label: "Firmy.cz",
    href: "https://www.firmy.cz/detail/13232461-2p-stavebni-pacov.html",
  },
  {
    label: "Podnikatel.cz – obchodní rejstřík",
    href: "https://www.podnikatel.cz/rejstrik/2p-stavebni-s-r-o-08318883/",
  },
  {
    label: "Kurzy.cz – rejstřík firem",
    href: "https://rejstrik-firem.kurzy.cz/08318883/2p-stavebni-sro/",
  },
  {
    label: "Veřejné zakázky",
    href: "https://www.vhodne-uverejneni.cz/profil/2p-stavebni-s-r-o",
  },
];
