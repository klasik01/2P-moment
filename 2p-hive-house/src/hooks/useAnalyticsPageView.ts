import { useEffect } from "react";
import type { CookieConsentState } from "../types";
import { initAnalytics, rejectAnalytics, trackPageView } from "../utils/analytics";

/**
 * Inicializuje Google Analytics dle consent stavu a reportuje pageview
 * při každé změně routy.
 *   - "accepted" → načte gtag.js + trackuje
 *   - "rejected" → nastaví kill-switch, GA se nenačte
 *   - "unset"    → nic (čekáme na volbu v cookie baneru)
 */
export function useAnalyticsPageView(
  path: string,
  consent: CookieConsentState,
  measurementId?: string,
) {
  useEffect(() => {
    if (!measurementId) return;

    if (consent === "rejected") {
      rejectAnalytics(measurementId);
      return;
    }
    if (consent === "accepted") {
      initAnalytics(measurementId);
      trackPageView(measurementId, path, document.title);
    }
  }, [path, consent, measurementId]);
}
