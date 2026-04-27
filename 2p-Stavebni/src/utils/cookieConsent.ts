export type CookieConsentState = "accepted" | "rejected" | "unset";

const COOKIE_CONSENT_KEY = "p-stavebni-cookie-consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export function getCookieConsent(): CookieConsentState {
  if (typeof document === "undefined") return "unset";

  const value = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_CONSENT_KEY}=`))
    ?.split("=")[1];

  if (value === "accepted" || value === "rejected") {
    return value;
  }

  return "unset";
}

export function setCookieConsent(state: Exclude<CookieConsentState, "unset">) {
  if (typeof document === "undefined") return;

  document.cookie = [
    `${COOKIE_CONSENT_KEY}=${state}`,
    "Path=/",
    `Max-Age=${COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ].join("; ");
}

/**
 * Smaže consent cookie → uživateli se při dalším renderu znovu zobrazí
 * banner (stav se vrátí na "unset"). GDPR požaduje, aby uživatel mohl
 * souhlas kdykoli odvolat nebo upravit – tento helper je cestou, jak
 * to pro 2P Stavební implementovat přes odkaz „Nastavení cookies"
 * ve footeru.
 */
export function clearCookieConsent() {
  if (typeof document === "undefined") return;

  document.cookie = [
    `${COOKIE_CONSENT_KEY}=`,
    "Path=/",
    "Max-Age=0",
    "SameSite=Lax",
  ].join("; ");
}
