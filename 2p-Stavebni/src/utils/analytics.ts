declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let initializedMeasurementId: string | null = null;

function ensureScript(measurementId: string) {
  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-ga-measurement-id="${measurementId}"]`,
  );

  if (existing) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.gaMeasurementId = measurementId;
  document.head.appendChild(script);
}

export function initAnalytics(measurementId: string) {
  if (typeof window === "undefined" || !measurementId) return;

  window[`ga-disable-${measurementId}`] = false;
  ensureScript(measurementId);

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

  if (initializedMeasurementId === measurementId) return;

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
    anonymize_ip: true,
  });

  initializedMeasurementId = measurementId;
}

export function disableAnalytics(measurementId: string) {
  if (typeof window === "undefined" || !measurementId) return;
  window[`ga-disable-${measurementId}`] = true;
}

export function trackPageView(measurementId: string, pagePath: string, pageTitle: string) {
  if (
    typeof window === "undefined" ||
    !measurementId ||
    !window.gtag ||
    window[`ga-disable-${measurementId}`]
  ) {
    return;
  }

  window.gtag("event", "page_view", {
    page_title: pageTitle,
    page_path: pagePath,
    page_location: window.location.href,
  });
}
