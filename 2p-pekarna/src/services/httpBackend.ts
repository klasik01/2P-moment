// ============================================================
// HTTP implementace BackendService — volá 2p-api na vm-twopmoment.
// Jediné místo v aplikaci, které sahá na síť.
// ============================================================

import type { InquiryInput } from "../types";
import type { BackendService } from "./contracts";

const TIMEOUT_MS = 15_000;

async function postJson(url: string, body: unknown): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Požadavek na ${url} selhal se stavem ${response.status}`);
  }
}

export function createHttpBackend(baseUrl: string): BackendService {
  const base = baseUrl.replace(/\/+$/, "");

  return {
    async createInquiry(input: InquiryInput): Promise<void> {
      await postJson(`${base}/pekarna/inquiry`, input);
    },
  };
}
