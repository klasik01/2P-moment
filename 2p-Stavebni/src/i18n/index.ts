import { cs } from "./locales/cs";
import type { LocaleCode, Translations } from "./types";

/**
 * Minimal i18n implementation.
 *
 * – One dictionary per locale, flat key/value (see `types.ts`).
 * – `t(key, params?)` returns the translation (or the key itself when
 *   a translation is missing, so the UI still renders something readable).
 * – `setLocale(code)` switches the active locale at runtime.
 *
 * Adding another language is a 2-step change:
 *   1. Create `locales/<code>.ts` exporting a `Translations` object that
 *      mirrors the CS dictionary.
 *   2. Register it in `registry` below.
 */

const registry: Record<LocaleCode, Translations> = { cs };

let currentLocale: LocaleCode = "cs";
const listeners = new Set<() => void>();

export function setLocale(code: LocaleCode) {
  if (!(code in registry)) {
    console.warn(`[i18n] unknown locale "${code}" – staying on "${currentLocale}"`);
    return;
  }
  currentLocale = code;
  if (typeof document !== "undefined") {
    document.documentElement.lang = code;
  }
  listeners.forEach((listener) => listener());
}

export function getLocale(): LocaleCode {
  return currentLocale;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key];
    return value === undefined ? match : String(value);
  });
}

export function t(key: string, params?: Record<string, string | number>): string {
  const dictionary = registry[currentLocale];
  const entry = dictionary[key];
  if (entry === undefined) {
    // Surface missing keys clearly during development without breaking the UI.
    if (import.meta.env.DEV) {
      console.warn(`[i18n] missing key "${key}" in locale "${currentLocale}"`);
    }
    return key;
  }
  return interpolate(entry, params);
}

/**
 * React hook-free helper – for components that need to re-render on locale
 * change. Use in a `useEffect` + `useState` pair. Kept side-by-side with
 * `t()` so components don't need a context provider for the common case.
 */
export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export type { LocaleCode, Translations } from "./types";
