// ============================================================
// Google Analytics (GA4) — consent-based loading.
// ============================================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

/** Zavolej při consent === "accepted". Idempotentní. */
export function initAnalytics(measurementId: string) {
  if (!measurementId) return;
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

export const disableAnalytics = rejectAnalytics;
