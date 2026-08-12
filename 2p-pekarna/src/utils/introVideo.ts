// Uvítací video se přehraje při příchodu na web a pak se po nastavenou
// dobu (introVideoTtlMinutes v pekarna.json) znovu neukáže — refresh
// v rámci té doby ho nespustí. Po vypršení se ukáže znovu.
//
// localStorage (ne sessionStorage) drží razítko i přes zavření záložky,
// takže cooldown platí napříč návštěvami, dokud nevyprší.

const KEY = "2p-pekarna-intro-seen-at";

/** True, když bylo video vidět a od té doby ještě neuplynula doba `ttlMs`. */
export function wasIntroSeen(ttlMs: number): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const seenAt = Number(raw);
    if (Number.isNaN(seenAt)) return false;
    return Date.now() - seenAt < ttlMs;
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    // storage nedostupný — nevadí, jen se video může ukázat i příště
  }
}

/** Jsme na úvodní stránce? */
export function isHomepage(): boolean {
  try {
    return window.location.pathname === "/";
  } catch {
    return false;
  }
}

/**
 * Přišel návštěvník z cizí domény (kliknutím na externí odkaz)?
 *
 * POZOR: ručně zadaná URL i záložka mají prázdný referrer (→ false)
 * a HTTPS→HTTP přechod referrer shodí. Proto je tahle podmínka
 * v configu volitelná (introVideoExternalOnly), defaultně vypnutá.
 */
export function cameFromExternalDomain(): boolean {
  try {
    const ref = document.referrer;
    if (!ref) return false;
    return new URL(ref).host !== window.location.host;
  } catch {
    return false;
  }
}
