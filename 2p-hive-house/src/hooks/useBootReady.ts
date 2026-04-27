import { useEffect, useState } from "react";

/**
 * Vrátí true jakmile jsou načtené všechny `required` klíče,
 * nebo po `timeoutMs` (fallback, aby web nezamrzl).
 */
export function useBootReady(
  loaded: Set<string>,
  required: readonly string[],
  timeoutMs = 5000,
): boolean {
  const allLoaded = required.every((k) => loaded.has(k));
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (allLoaded) return;
    const t = setTimeout(() => setTimedOut(true), timeoutMs);
    return () => clearTimeout(t);
  }, [allLoaded, timeoutMs]);

  return allLoaded || timedOut;
}
