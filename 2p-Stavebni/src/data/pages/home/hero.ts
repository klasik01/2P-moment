import { ROUTES } from "../../../config/routes";
import type { HeroContent } from "../../../types/content";
import { company } from "../../company";

export const hero: HeroContent = {
  eyebrow: "Stavební firma Pacov",
  title: "Kvalitní a efektivní",
  titleAccent: "provádění staveb",
  description:
    "Stojíme za každým projektem. Od rodinných domů po rekonstrukce veřejných budov – přinášíme řešení nejvyšší kvality s plnou transparentností.",
  backgroundImage: "https://2pstavebni.cz/assets/images/projects/6/1.jpg",
  brandLogo: company.logos.light,
  primaryAction: { label: "Naše reference", href: ROUTES.projects },
  secondaryAction: { label: "Kontaktujte nás", href: ROUTES.contact },
  stats: [
    { value: 15, suffix: "+", label: "Let zkušeností" },
    { value: 25, label: "Realizovaných projektů" },
    { value: 24, suffix: "/7", label: "Přehled o stavbě" },
  ],
};
