import { useEffect } from "react";

/**
 * Chování otevřeného modálu: Escape zavírá a stránka pod ním
 * nesmí rolovat. Sdílené všemi dialogy včetně lightboxu.
 */
export function useModalOpen(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.classList.add("is-modal-open");
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.classList.remove("is-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);
}
