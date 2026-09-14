import type { GrantsContent } from "../../../types/content";

/**
 * Dotační programy – projekty spolufinancované EU včetně povinné publicity.
 * Obrázky i dokumenty jsou servírovány z `public/assets/`, proto prefix
 * `BASE_URL` (Netlify `/`, GitHub Pages `/2p-stavebni-web/`).
 */
const BASE = import.meta.env.BASE_URL;

export const grants: GrantsContent = {
  displayMode: "image", // Přepnutím na "detail" zobrazíte původní texty a detail s PDF.
  label: "Podpořené projekty",
  title: "Dotační",
  titleAccent: "programy",
  description:
    "Rozvíjíme své zázemí i s podporou evropských fondů. Zde najdete projekty, které jsou spolufinancovány Evropskou unií, včetně jejich povinné publicity.",
  items: [
    {
      slug: "technicke-zazemi-2p-stavebni",
      kind: "document",
      category: "Spolufinancováno Evropskou unií",
      title: "Technické zázemí společnosti 2P stavební s.r.o.",
      summary:
        "Cílem projektu je vybudování vlastního technického zázemí, které umožní lepší organizaci stavebních prací, zefektivní logistiku materiálu a techniky, výrazně sníží náklady na pronájmy a zvýší celkovou kapacitu pro nové zakázky. Projekt je realizován v rámci Strategického plánu SZP a je spolufinancován Evropskou unií.",
      location: "Strategický plán SZP",
      documentUrl: `${BASE}assets/documents/grants/publicita-technicke-zazemi-2.pdf`,
      images: [
        {
          src: `${BASE}assets/images/grants/technicke-zazemi/publicita-a3-2.jpg`,
          alt: "Publicita projektu Technické zázemí společnosti 2P stavební s.r.o. – spolufinancováno Evropskou unií",
          isPrimary: true,
        },
      ],
    },
  ],
};
