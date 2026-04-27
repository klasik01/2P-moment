// ============================================================
// Google Analytics (GA4) — consent-based loading.
//
// Scénáře:
//   - Uživatel NEZVOLIL (unset)   → GA se vůbec nenačte.
//   - Uživatel PŘIJAL  (accepted) → initAnalytics() stáhne gtag.js a začne trackovat.
//   - Uživatel ODMÍTL  (rejected) → rejectAnalytics() nastaví disable flag
//                                    — GA se nenačte, případné existující
//                                    volání jsou blokovaná.
// ============================================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    // GA honoruje window[`ga-disable-${id}`] jako kill-switch.
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

/** Zavolej při consent === "accepted". Idempotentní. */
export function initAnalytics(measurementId: string) {
  if (!measurementId) return;
  // Reset případného disable flagu z předchozí session (defenzivní úklid).
  window[`ga-disable-${measurementId}`] = false;

  if (document.getElementById("ga-script")) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

/**
 * Zavolej při consent === "rejected". GA se nenačte (flag se nastaví
 * ještě před případným loadem); pokud už běží, přestane posílat data.
 */
export function rejectAnalytics(measurementId: string) {
  if (!measurementId) return;
  window[`ga-disable-${measurementId}`] = true;
  if (Array.isArray(window.dataLayer)) window.dataLayer.length = 0;
}

export function trackPageView(measurementId: string, path: string, title: string) {
  window.gtag?.("config", measurementId, { page_path: path, page_title: title });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  window.gtag?.("event", name, params);
}

// Zpětně kompatibilní alias pro starší importy.
export const disableAnalytics = rejectAnalytics;
