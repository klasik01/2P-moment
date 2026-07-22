import type { Translations } from "../../i18n";
import { Modal } from "../ui/Modal";

type LegalDocument = {
  title: string;
  content: string;
};

type Props = {
  document: LegalDocument;
  t: Translations;
  onClose: () => void;
};

export function LegalModal({ document: doc, t, onClose }: Props) {
  return (
    <Modal onClose={onClose} closeLabel={t.common.close} labelledBy="legal-title">
      <div className="modal__body">
        <h2 id="legal-title" className="modal__title">{doc.title}</h2>
        <div
          className="modal__prose"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />
      </div>
    </Modal>
  );
}
