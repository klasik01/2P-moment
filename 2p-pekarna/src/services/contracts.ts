// ============================================================
// Service contracts — definují rozhraní pro všechny backend operace.
// Komponenty volají POUZE fasádu, nikdy přímo implementaci.
// ============================================================

import type { Promotion } from "../types";
import type { ProfileName } from "../config/profiles";

// ---- App Settings ----

export type AppSettings = {
  activeProfiles: ProfileName[];
};

// ---- Subscription (email z construction popupu) ----

export type SubscriptionEntry = {
  email: string;
  source: string;
};

// ---- Backend Service Contract ----

export interface BackendService {
  // -- Promotions --
  subscribePromotions(
    onData: (promos: Promotion[]) => void,
    onError?: () => void,
  ): () => void;

  savePromotion(promo: Promotion): Promise<void>;
  deletePromotion(id: string): Promise<void>;

  // -- App Settings (profily) --
  fetchAppSettings(): Promise<AppSettings>;
  saveAppSettings(settings: AppSettings): Promise<void>;

  // -- Email Subscriptions --
  createSubscription(entry: SubscriptionEntry): Promise<string>;
}
