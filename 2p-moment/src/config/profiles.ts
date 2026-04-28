// ============================================================
// Profily webu — přepínají chování a viditelnost prvků.
//
// VE_VYSTAVBE  → web je ve výstavbě, nepřijímá rezervace
// BEZ_REKLAMY  → žádná promo videa, žádné intro video v hero
// ============================================================

import { momentConfig } from "../data/moment";

export type ProfileName = "VE_VYSTAVBE" | "BEZ_REKLAMY";

const FALLBACK_PROFILES: ProfileName[] = [
  "VE_VYSTAVBE",
  "BEZ_REKLAMY",
];

let activeSet = new Set<ProfileName>(FALLBACK_PROFILES);

export function setActiveProfiles(profiles: ProfileName[]) {
  activeSet = new Set<ProfileName>(profiles);
}

export function isActive(name: ProfileName): boolean {
  return activeSet.has(name);
}

export function getActiveProfiles(): ProfileName[] {
  return Array.from(activeSet);
}

const cfg = momentConfig;

export const constructionConfig = {
  expectedDate: cfg.expectedOpenDate,
  badge: cfg.badge,
  popupTitle: cfg.construction.popupTitle,
  popupText: `${cfg.construction.popupText} Předpokládaný termín spuštění je ${cfg.expectedOpenDate.toLowerCase()}.`,
  popupCtaLabel: cfg.construction.popupCtaLabel,
  popupSuccessMessage: cfg.construction.popupSuccessMessage,
  popupEmailPlaceholder: cfg.construction.popupEmailPlaceholder,
  firestoreCollection: cfg.firestore.subscriptionsCollection,
  heroCtaLabel: cfg.construction.heroCtaLabel,
} as const;
