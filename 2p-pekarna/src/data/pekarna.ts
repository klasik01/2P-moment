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
  /** Vypínač uvítacího videa. false = popup se nikdy nezobrazí. */
  introVideoEnabled?: boolean;
  /** Po zhlédnutí se video znovu neukáže tolik minut. Default 60. */
  introVideoTtlMinutes?: number;
  /** true = ukázat jen při příchodu z cizí domény. Default false. */
  introVideoExternalOnly?: boolean;
  /** Uvítací video v popupu při příchodu. Prázdné = popup se nezobrazí. */
  introVideo?: string;
};

export const pekarnaConfig = raw as PekarnaConfig;
