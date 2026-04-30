import { useCallback, useEffect, useState } from "react";

/**
 * Hook pro lightbox přes seznam obrázků.
 * - open(index) → otevře na konkrétním indexu
 * - close()     → zavře
 * - prev/next   → cykluje přes pole
 * - klávesy: ESC zavře, ←/→ navigují
 * - body se uzamkne před scrollováním
 */
export function useLightbox(total: number) {
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;

  const open = useCallback((i: number) => {
    if (i < 0 || i >= total) return;
    setIndex(i);
  }, [total]);

  const close = useCallback(() => setIndex(null), []);

  const prev = useCallback(() => {
    setIndex((cur) => (cur === null ? null : (cur - 1 + total) % total));
  }, [total]);

  const next = useCallback(() => {
    setIndex((cur) => (cur === null ? null : (cur + 1) % total));
  }, [total]);

  // Klávesnice
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close, prev, next]);

  // Body lock
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  return { index, isOpen, open, close, prev, next };
}
