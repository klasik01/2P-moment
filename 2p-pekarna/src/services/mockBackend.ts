// ============================================================
// Mock implementace BackendService.
//
// Používá se, když není nastavené VITE_API_URL — tedy při lokálním
// vývoji a na ukázkovém nasazení pro klienty, kde backend ještě neběží.
// Poptávka se nikam neodešle, jen se vypíše do konzole.
// ============================================================

import type { InquiryInput } from "../types";
import type { BackendService } from "./contracts";

/** Ať je v UI vidět stav „Odesílám…“ a nepůsobí to jako že se nic neděje. */
const FAKE_LATENCY_MS = 700;

export function createMockBackend(): BackendService {
  return {
    async createInquiry(input: InquiryInput): Promise<void> {
      await new Promise((resolve) => setTimeout(resolve, FAKE_LATENCY_MS));
      console.info(
        "[mockBackend] Poptávka se nikam neodeslala — VITE_API_URL není nastavené.",
        input,
      );
    },
  };
}
