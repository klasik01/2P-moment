// ============================================================
// Service contracts — definují rozhraní pro všechny backend operace.
// Komponenty volají POUZE fasádu, nikdy přímo implementaci.
// ============================================================

import type { InquiryInput } from "../types";

export interface BackendService {
  /** Odešle poptávku z formuláře. Chybu vyhodí, ať ji formulář zobrazí. */
  createInquiry(input: InquiryInput): Promise<void>;
}
