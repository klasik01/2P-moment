// ============================================================
// Zkrácený barrel export — jeden import pro sekce + hero layouty.
// Zdroje:
//   ./sections/  → plug-and-play sekce homepage (AboutSection, ApitherapySection, …)
//   ./layout/    → PageHero pro podstránky
//
// Použití:
//   import { AboutSection, ContactPanel, PageHero } from "@/components/sections";
// ============================================================

export * from "./sections/index";
export { PageHero } from "./layout/PageHero";
