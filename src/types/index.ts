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
};

export type ManagedImage = {
  url: string;
  storagePath?: string;
  alt?: string;
};

export type RoomContent = {
  id: string;
  title: string;
  description: string;
  labels: string[];
  images: ManagedImage[];
};

export type AppId = "hive-house";

export type AdminSection =
  | "dashboard"
  | "promotions"
  | "surroundings"
  | "room"
  | "permits"
  | "vouchers"
  | "statistics";
