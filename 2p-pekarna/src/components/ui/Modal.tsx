import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { useModalOpen } from "../../hooks/useModalOpen";

type Props = {
  children: ReactNode;
  onClose: () => void;
  /** Popisek zavíracího tlačítka — z i18n. */
  closeLabel: string;
  labelledBy?: string;
  className?: string;
};

/**
 * Sdílený dialog. Zavírá klikem mimo, Escapem i křížkem;
 * pod sebou zamyká rolování stránky.
 */
export function Modal({
  children,
  onClose,
  closeLabel,
  labelledBy,
  className = "",
}: Props) {
  useModalOpen(true, onClose);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal ${className}`.trim()}>
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label={closeLabel}
        >
          <Icon name="close" size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
