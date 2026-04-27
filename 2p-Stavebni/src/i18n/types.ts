/**
 * Language code – ISO 639-1. Add new codes as new locale files are added.
 */
export type LocaleCode = "cs";

/**
 * Flat dictionary of translation keys. Keys are dot-separated by convention:
 *   `<scope>.<slot>` – e.g. `footer.navigationHeading`, `modal.close`.
 *
 * A flat shape keeps the `t()` helper simple and makes it trivial to
 * statically detect missing keys – every locale file must satisfy
 * `Translations`.
 */
export type Translations = Record<string, string>;
