// ============================================================
// i18n — UI texty.
//
// Systémové a ovládací texty (tlačítka, aria popisky, hlášky)
// žijí v cs.json / en.json. Obsah stránek je jinde: v src/data/*.json,
// protože pochází přímo ze zadání klienta.
//
// Přidání jazyka: nový soubor + zápis do `dictionaries`. Pro plný
// překlad webu bude potřeba lokalizovat i src/data.
// ============================================================

import cs from "./cs.json";
import en from "./en.json";

export type Locale = "cs" | "en";

/** Tvar slovníku určuje čeština — ostatní jazyky ho musí splnit. */
export type Translations = typeof cs;

export const DEFAULT_LOCALE: Locale = "cs";

const dictionaries: Record<Locale, Translations> = {
  cs,
  en: en as Translations,
};

export function getTranslations(locale: Locale = DEFAULT_LOCALE): Translations {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

/**
 * Doplní `{placeholdery}` v řetězci ze slovníku.
 *   format(t.lightbox.counter, { current: 2, total: 8 }) → "2 z 8"
 */
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? String(values[key]) : `{${key}}`,
  );
}

/** Výchozí slovník. */
export const t = getTranslations();
