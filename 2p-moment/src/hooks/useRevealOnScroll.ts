import { useEffect } from "react";

/**
 * Přidá třídu "visible" na prvky s .reveal / .reveal-left / .reveal-right,
 * jakmile se objeví ve viewportu. Odpalovaná znova po změně `dep`.
 */
export function useRevealOnScroll(dep: unknown, ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    const nodes = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep, ready]);
}
