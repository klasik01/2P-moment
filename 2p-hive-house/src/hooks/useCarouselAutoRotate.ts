import { useCallback, useEffect, useState, type RefObject } from "react";

type Options = {
  /** Matchmedia dotaz, kdy je carousel aktivní. Default = tablet. */
  query?: string;
  /** Interval mezi auto-posuny (ms). */
  intervalMs?: number;
  /** Pauza po uživatelské interakci (ms). */
  pauseMs?: number;
};

type Result = {
  /** Index aktuálně nejvíce viditelné karty. */
  activeIndex: number;
  /** Počet scroll pozic (dots). */
  count: number;
  /** Přesune slider na konkrétní index. */
  goTo: (index: number) => void;
  /** True jen když je media query match (tablet). */
  isActive: boolean;
};

/**
 * Jednoduchý horizontální scroll-snap carousel:
 *   - Aktivní jen při `query` (výchozí: tablet 768–1023 px).
 *   - Auto-rotace: posouvá se doprava, po dosažení konce zpět doleva,
 *     po dosažení začátku zase doprava — ping-pong.
 *   - Pauzuje na interakci (touch/mouse/wheel).
 *   - Klikatelné „dots" přes `goTo(i)`.
 *
 * Žádné zrcadlení ani duplikování v DOM — jen samotné karty, které
 * consumer vykreslí jednou.
 */
export function useCarouselAutoRotate(
  ref: RefObject<HTMLElement | null>,
  deps: ReadonlyArray<unknown> = [],
  {
    query = "(min-width: 768px) and (max-width: 1023.98px)",
    intervalMs = 2500,
    pauseMs = 6000,
  }: Options = {},
): Result {
  const [activeIndex, setActiveIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  const readStep = useCallback((el: HTMLElement): number => {
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return 0;
    const cs = window.getComputedStyle(el);
    const gap = parseFloat(cs.columnGap || cs.gap || "0") || 0;
    return first.offsetWidth + gap;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const el = ref.current;
      if (!el) return;
      const s = readStep(el);
      if (!s) return;
      el.scrollTo({ left: s * index, behavior: "smooth" });
    },
    [ref, readStep],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mql = window.matchMedia(query);
    let timer: number | null = null;
    let pauseUntil = 0;
    let direction: 1 | -1 = 1;

    const recomputeCount = () => {
      const s = readStep(el);
      if (!s) return;
      const total = el.children.length;
      const visible = Math.max(1, Math.floor(el.clientWidth / s));
      setCount(Math.max(1, total - visible + 1));
    };

    const updateIndex = () => {
      const s = readStep(el);
      if (!s) return;
      setActiveIndex(Math.round(el.scrollLeft / s));
    };

    const tick = () => {
      if (Date.now() < pauseUntil) return;
      const s = readStep(el);
      if (!s) return;
      const maxScroll = el.scrollWidth - el.clientWidth;

      // Reverzace směru na krajích
      if (el.scrollLeft >= maxScroll - 2 && direction === 1) direction = -1;
      else if (el.scrollLeft <= 2 && direction === -1) direction = 1;

      el.scrollBy({ left: s * direction, behavior: "smooth" });
    };

    const start = () => {
      stop();
      setIsActive(mql.matches);
      if (!mql.matches) return;
      timer = window.setInterval(tick, intervalMs);
    };
    const stop = () => {
      if (timer !== null) { clearInterval(timer); timer = null; }
    };
    const pause = () => { pauseUntil = Date.now() + pauseMs; };

    recomputeCount();
    updateIndex();
    start();

    mql.addEventListener("change", start);
    el.addEventListener("scroll", updateIndex, { passive: true });
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("mousedown", pause);
    el.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("resize", recomputeCount);

    return () => {
      stop();
      mql.removeEventListener("change", start);
      el.removeEventListener("scroll", updateIndex);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("mousedown", pause);
      el.removeEventListener("wheel", pause);
      window.removeEventListener("resize", recomputeCount);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, intervalMs, pauseMs, readStep, ...deps]);

  return { activeIndex, count, goTo, isActive };
}
