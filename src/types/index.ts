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

export type AppId = "hive-house";

export type AdminSection =
  | "dashboard"
  | "promotions"
  | "permits"
  | "vouchers"
  | "statistics";
