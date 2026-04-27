// ============================================================
// Globální konfigurace Hive House — jediný zdroj pravdy pro
// název, kontakt, termíny, construction texty atd.
// ============================================================

import raw from "./hive-house.json";

export type HiveHouseConfig = {
  name: string;
  tagline: string;
  expectedOpenDate: string;
  badge: string;
  url: string;
  company: { name: string; ico: string };
  contact: { email: string; phone: string; address: string };
  checkInOut: { checkIn: string; checkOut: string };
  socials: { instagram: string };
  construction: {
    popupTitle: string;
    popupText: string;
    popupCtaLabel: string;
    popupSuccessMessage: string;
    popupEmailPlaceholder: string;
    heroCtaLabel: string;
  };
  firestore: {
    subscriptionsCollection: string;
    settingsCollection: string;
    settingsDoc: string;
  };
};

export const hiveHouseConfig = raw as HiveHouseConfig;
