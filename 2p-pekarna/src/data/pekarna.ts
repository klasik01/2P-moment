// ============================================================
// Globální konfigurace 2P Pekárna — jediný zdroj pravdy pro
// název, kontakt, termíny.
// ============================================================

import raw from "./pekarna.json";

export type PekarnaConfig = {
  name: string;
  tagline: string;
  url: string;
  company: { name: string; ico: string };
  contact: { email: string; phone: string; address: string };
  checkInOut: { checkIn: string; checkOut: string };
  socials: { instagram: string };
  firestore: {
    promotionsCollection: string;
  };
};

export const pekarnaConfig = raw as PekarnaConfig;
