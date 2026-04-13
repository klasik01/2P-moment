export type Promotion = {
  id: string;
  enabled: boolean;
  startsAt?: string;
  endsAt?: string;
  badge: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export type FishingPermit = {
  id: string;
  name: string;
  email: string;
  date: string;
  persons: number;
  isFirefighter: boolean;
  isHojanoviceChild: boolean;
  pricePaid: number;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
};

export type GiftVoucher = {
  id: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message?: string;
  nights: number;
  pricePaid: number;
  code: string;
  status: "pending" | "paid" | "used" | "expired";
  createdAt: string;
  validUntil: string;
};

export type SurroundingPlace = {
  id: string;
  enabled: boolean;
  sortOrder: number;
  title: string;
  subtitle: string;
  distance: string;
  description: string;
  imageUrl: string;
  imageStoragePath?: string;
  linkHref: string;
  tags: string[];
  gallery: ManagedImage[];
  mapEmbedUrl?: string;
  tip?: string;
};

export type ManagedImage = {
  url: string;
  storagePath?: string;
  alt?: string;
};

export type StorySectionLayout = "text" | "image-left";

export type RoomStorySection = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  layout?: StorySectionLayout;
  image?: ManagedImage;
};

export type RoomEquipmentItem = {
  id: string;
  icon: string;
  title: string;
  desc: string;
};

export type RoomFacilityItem = {
  id: string;
  icon: string;
  title: string;
  desc: string;
};

export type RoomContent = {
  id: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage?: ManagedImage;
  detailEyebrow: string;
  title: string;
  detailHighlight: string;
  description: string;
  modalTitle: string;
  modalSubtitle: string;
  modalDescription: string;
  reserveLabel: string;
  galleryLabel: string;
  voucherLabel: string;
  showReserveBtn: boolean;
  showGalleryBtn: boolean;
  showVoucherBtn: boolean;
  buttonsOrder: Array<"reserve" | "gallery" | "voucher">;
  labels: string[];
  images: ManagedImage[];
  sections: RoomStorySection[];
  equipment: RoomEquipmentItem[];
  facilities: RoomFacilityItem[];
  intentional: RoomFacilityItem[];
};

export type FishingStep = {
  id: string;
  icon: string;
  title: string;
  text: string;
};

export type FishingInfoCard = {
  id: string;
  label: string;
  value: string;
};

export type FishingContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage?: ManagedImage;
  stepsTitle: string;
  steps: FishingStep[];
  infoCards: FishingInfoCard[];
  ctaLabel: string;
  ctaHref: string;
  gallery: ManagedImage[];
};

export type SurroundingsPageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage?: ManagedImage;
  sectionTitle: string;
  sectionSubtitle: string;
};

export type GlampingCard = {
  id: string;
  selected: boolean;
  sortOrder: number;
  title: string;
  subtitle: string;
  description: string;
  image?: ManagedImage;
};

export type ApiaryExperienceStep = {
  id: string;
  icon: string;
  title: string;
  text: string;
};

export type ApiaryProduct = {
  id: string;
  icon: string;
  title: string;
  text: string;
};

export type ApiaryContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImage?: ManagedImage;
  glampingTitle: string;
  glampingSubtitle: string;
  glampingCards: GlampingCard[];
  beeLivingTitle: string;
  beeLivingHighlight: string;
  beeLivingText: string;
  beeLivingImage?: ManagedImage;
  apiTherapyTitle: string;
  apiTherapyHighlight: string;
  apiTherapyText: string;
  apiTherapyImage?: ManagedImage;
  apiTherapyProducts: ApiaryProduct[];
  // Nová struktura stránky Včelín
  experienceEyebrow: string;
  experienceTitle: string;
  experienceHighlight: string;
  experienceIntro: string;
  experienceSteps: ApiaryExperienceStep[];
  gallery: ManagedImage[];
};

export type Review = {
  id: string;
  enabled: boolean;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string;
  source?: string;
  sortOrder: number;
};

export type ContactContent = {
  contactName: string;
  phone: string;
  email: string;
  companyName: string;
  ico: string;
  address: string;
  checkIn: string;
  checkOut: string;
  capacity: number;
  notes: string;
  mapEmbedUrl?: string;
};

// ── Konfigurace formuláře dárkové poukázky ───────────────────────────────────
export type VoucherFormConfig = {
  modalTitle: string;
  modalDesc: string;
  successMessage: string;
  pricePerNight: number;
  nightOptions: number[];
  validityMonths: number;
  payButtonLabel: string;
  cancelButtonLabel: string;
};

// ── Konfigurace formuláře rybářské povolenky ─────────────────────────────────
export type PermitFormConfig = {
  modalTitle: string;
  modalDesc: string;
  successMessage: string;
  priceAdult: number;
  priceFirefighter: number;
  priceChild: number;
  maxPersons: number;
  discountFirefighterEnabled: boolean;
  discountFirefighterLabel: string;
  discountChildEnabled: boolean;
  discountChildLabel: string;
  payButtonLabel: string;
  cancelButtonLabel: string;
};

// ── Homepage sekce (ukládané separátně do DB) ──────────────────────────────

export type HomepageHero = {
  title: string;
  titleAccent: string;
  subtitle: string;
  text: string;
  ctaReserveLabel: string;
  ctaReserveHref: string;
  ctaVoucherLabel: string;
  stat1Num: string;
  stat1Label: string;
  stat2Num: string;
  stat2Label: string;
  stat3Num: string;
  stat3Label: string;
  images: ManagedImage[];
};

export type HomepageOfferingCard = {
  id: string;
  sortOrder: number;
  title: string;
  description: string;
  eyebrow: string;
  linkHref: string;
  ctaLabel: string;
  image?: ManagedImage;
};

export type HomepageOfferings = {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionTitleAccent: string;
  sectionDesc: string;
  cards: HomepageOfferingCard[];
};

export type HomepageApiBenefit = {
  id: string;
  icon: string;
  text: string;
};

export type HomepageApitherapy = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  text1: string;
  text2: string;
  benefits: HomepageApiBenefit[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  imageMain?: ManagedImage;
  imageSmall1?: ManagedImage;
  imageSmall2?: ManagedImage;
};

export type HomepageTrustbar = {
  items: string[];
};

export type HomepageReviewsConfig = {
  displayCount: number;
};

export type AppId = "hive-house" | "stavebni";

export type AdminSection =
  | "dashboard"
  | "promotions"
  | "room"
  | "permits"
  | "vouchers"
  | "fishing"
  | "apiary"
  | "reviews"
  | "contact"
  | "voucher-config"
  | "permit-config"
  | "homepage"
  | "statistics";
