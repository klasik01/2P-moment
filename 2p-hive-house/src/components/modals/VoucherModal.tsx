import type { T } from "../../i18n";
import { useModalOpen } from "../../hooks/useModalOpen";

/**
 * Prázdný popup pro dárkovou poukázku.
 * Formulář se dopíše později — zatím jen vizuální placeholder.
 * Stejný vzhled jako FishingModal, jiný text.
 */
export function VoucherModal({ t, onClose }: { t: T; onClose: () => void }) {
  useModalOpen(true, onClose);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="voucher-title" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t.common.close}>✕</button>
        <h2 id="voucher-title" className="modal-title">{t.voucher.modalTitle}</h2>
        <p className="modal-desc">{t.voucher.modalDesc}</p>

        <div className="modal-placeholder">
          {t.voucher.soon}
        </div>

        <p className="modal-desc" style={{ marginTop: '1rem' }}>
          {t.voucher.contactInfo}{' '}
          <a href="tel:+420774110224" style={{ fontWeight: 600 }}>+420 774 110 224</a>.
        </p>
      </div>
    </div>
  );
}
