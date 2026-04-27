// ============================================================
// Tenká TS vrstva nad homepage.json — typovaný singleton, ze kterého
// si jednotlivé sekce mohou jednoduše vytáhnout default data, když
// je nedostanou přes props.
//
// Použití:
//   import { AboutSection } from "@/components/sections";
//   <AboutSection />     // → použije defaultní data
//   <AboutSection data={custom} />  // → přepíše
// ============================================================

import type { HomepageData } from "../types";
import raw from "./homepage.json";

export const homepageData = raw as HomepageData;

// Shortcut exporty pro sekce (nepovinné, ale příjemné).
export const aboutData        = homepageData.about;
export const apitherapyData   = homepageData.apitherapy;
export const howItWorksData   = homepageData.howItWorks;
export const offeringsData    = homepageData.offerings;
export const videoSectionData = homepageData.videoSection;
export const galleryData      = homepageData.gallery;
export const fishingCtaData   = homepageData.fishingCta;
export const contactData      = homepageData.contact;
export const reservationData  = homepageData.reservation;
