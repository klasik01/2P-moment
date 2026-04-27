import type { FaqEntry } from "../../types/content";

/**
 * FAQ entries – vedle viditelné sekce FaqSection jsou zdrojem i pro
 * FAQPage JSON-LD schema (AEO, featured snippets, voice search). Typ
 * pochází ze `types/content.ts`, aby jeden zdroj pravdy pokryl i UI
 * komponenty.
 *
 * Tento soubor zachová zpětnou kompatibilitu s `data/seo/index.ts` –
 * viditelná data sekce (label, title, description) jsou v
 * `data/pages/home/faq.ts`, které samy `items` odkazují sem.
 */
export const faq: FaqEntry[] = [
  {
    question: "Kde působí firma 2P Stavební?",
    answer:
      "Sídlíme v Pacově (Kraj Vysočina) a realizujeme stavby v rámci celé České republiky – nejčastěji v okresech Pelhřimov, Humpolec a Havlíčkův Brod.",
  },
  {
    question: "Jaké stavební práce nabízíte?",
    answer:
      "Poskytujeme komplexní realizaci pozemních staveb, rekonstrukce, montáž výplní otvorů (okna a dveře), stavební dozor, koordinaci subdodávek, rozpočtové služby a montáž protipožárních ucpávek.",
  },
  {
    question: "Jak funguje elektronický stavební deník?",
    answer:
      "Jako investor získáte přístup k online stavebnímu deníku, kde v reálném čase sledujete postup prací, fotodokumentaci, zápisy a rozpočtové úpravy. Přístup je 24/7, bez nutnosti osobní návštěvy stavby.",
  },
  {
    question: "Kolik stojí realizace stavby u 2P Stavební?",
    answer:
      "Každá stavba je individuální. Cena se odvíjí od rozsahu, zvolených materiálů a technologií. Zpracujeme vám bezplatný rozpočet na míru – stačí nás kontaktovat přes email nebo zavolat na +420 774 110 224.",
  },
  {
    question: "Jak dlouho trvá realizace rodinného domu?",
    answer:
      "Realizace rodinného domu trvá obvykle 8–14 měsíců od zahájení výkopových prací po kolaudaci. Přesný harmonogram stanovíme po první schůzce a prohlídce projektové dokumentace.",
  },
];

export type { FaqEntry };
