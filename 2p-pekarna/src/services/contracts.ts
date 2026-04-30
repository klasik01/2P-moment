// ============================================================
// Service contracts — definují rozhraní pro všechny backend operace.
// Komponenty volají POUZE fasádu, nikdy přímo implementaci.
// ============================================================

import type { Promotion } from "../types";

// ---- Backend Service Contract ----

export interface BackendService {
  // -- Promotions --
  subscribePromotions(
    onData: (promos: Promotion[]) => void,
    onError?: () => void,
  ): () => void;

  savePromotion(promo: Promotion): Promise<void>;
  deletePromotion(id: string): Promise<void>;
}
