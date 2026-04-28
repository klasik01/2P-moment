import { ROUTES } from "../../../config/routes";
import type { AboutContent } from "../../../types/content";

export const about: AboutContent = {
  label: "O naší firmě",
  title: "Kdo",
  titleAccent: "jsme?",
  paragraphs: [
    "Jsme firma, která stojí na pevných základech dlouholetých zkušeností v stavebním odvětví, a naší hlavní prioritou je přinášet řešení nejvyšší kvality. Věnujeme se nejen celkové realizaci pozemních staveb, ale také poskytujeme širokou škálu inženýrských služeb.",
    "V naší práci klademe velký důraz na inovace a technologie. S hrdostí využíváme elektronický stavební deník, díky čemuž můžete jako investoři v reálném čase sledovat pokrok vaší stavby přes webové rozhraní.",
  ],
  mainImage: "",
  accentImage: "",
  badgeValue: "10+",
  badgeText: "Let v oboru",
  features: [
    "Kompletní dodávky výplní otvorů",
    "Profesionální montáž požárních ucpávek",
    "Transparentní komunikace s investory",
    "Realizace od malých do velkých projektů",
  ],
  action: { label: "Kontaktujte nás", href: ROUTES.contact },
};
