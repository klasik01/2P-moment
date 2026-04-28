import type { CookieConsentState } from "../types";

const COOKIE_KEY = "2p-pekarna-cookie-consent";

export function getCookieConsent(): CookieConsentState {
  try {
    const val = localStorage.getItem(COOKIE_KEY);
    if (val === "accepted" || val === "rejected") return val;
  } catch {
    // localStorage nedostupný
  }
  return "unset";
}

export function setCookieConsent(state: Exclude<CookieConsentState, "unset">) {
  try {
    localStorage.setItem(COOKIE_KEY, state);
  } catch {
    // localStorage nedostupný
  }
}
