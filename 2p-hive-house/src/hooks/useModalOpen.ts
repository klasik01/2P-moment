import { useEffect } from "react";

/**
 * Společná logika pro dialogová okna:
 *  - zamkne skroll těla (class `modal-open`)
 *  - po stisku Escape zavolá `onClose`
 *  - po odmountu / zavření vše uklidí
 *
 * Použití:
 *   useModalOpen(isOpen, () => setIsOpen(false));
 */
export function useModalOpen(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);
}
