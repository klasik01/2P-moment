// ============================================================
// Typovaný obal zastřešujícího rozcestníku 2P Moment.
// Obsah je v landing.json.
// ============================================================

import raw from "./landing.json";

export type ProjectCard = {
  id: string;
  name: string;
  descriptor: string;
  location: string;
  href: string;
  cta: string;
  /** Cesta k obrázku loga (public/). */
  logo?: string;
  /** Textová značka, když projekt nemá obrázkové logo (Pekárna). */
  logoText?: string;
};

export type LandingContact = {
  heading: string;
  email: string;
  phone: string;
  legalHeading: string;
  company: string;
  ico: string;
  dic: string;
  dataBox: string;
  addressLines: string[];
  note: string;
};

export type LandingData = {
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    brand: string;
    statement: string;
    hint: string;
  };
  projects: ProjectCard[];
  contact: LandingContact;
};

export const landing = raw as LandingData;
