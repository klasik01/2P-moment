// ============================================================
// Profily webu — přepínají chování a viditelnost prvků.
//
// VE_VYSTAVBE  → web je ve výstavbě, nepřijímá rezervace
// BEZ_REKLAMY  → žádná promo videa, žádné intro video v hero
//
// Profily se načítají z Firestore (settings/app). Dokud data
// nedorazí, používá se fallback z tohoto souboru.
// ============================================================

import { hiveHouseConfig } from "../data/hive-house";

export type ProfileName = "VE_VYSTAVBE" | "BEZ_REKLAMY";

// Fallback profily (použijí se, než dorazí data z Firestore)
const FALLBACK_PROFILES: ProfileName[] = [
  "VE_VYSTAVBE",
  "BEZ_REKLAMY",
];

// Runtime stav — přepíše se po načtení z Firestore
let activeSet = new Set<ProfileName>(FALLBACK_PROFILES);

/** Nastaví aktivní profily (volá se po načtení z Firestore). */
export function setActiveProfiles(profiles: ProfileName[]) {
  activeSet = new Set<ProfileName>(profiles);
}

/** Je profil aktivní? */
export function isActive(name: ProfileName): boolean {
  return activeSet.has(name);
}

/** Vrátí seznam aktuálně aktivních profilů. */
export function getActiveProfiles(): ProfileName[] {
  return Array.from(activeSet);
}

const cfg = hiveHouseConfig;

// ---- Nastavení pro VE_VYSTAVBE ----
export const constructionConfig = {
  expectedDate: cfg.expectedOpenDate,
  badge: cfg.badge,
  popupTitle: cfg.construction.popupTitle,
  popupText: `${cfg.construction.popupText} Předpokládaný termín otevření je ${cfg.expectedOpenDate.toLowerCase()}.`,
  popupCtaLabel: cfg.construction.popupCtaLabel,
  popupSuccessMessage: cfg.construction.popupSuccessMessage,
  popupEmailPlaceholder: cfg.construction.popupEmailPlaceholder,
  firestoreCollection: cfg.firestore.subscriptionsCollection,
  heroCtaLabel: cfg.construction.heroCtaLabel,
} as const;
