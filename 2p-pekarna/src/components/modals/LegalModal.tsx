type LegalDocument = {
  title: string;
  content: string;
};

type Props = {
  document: LegalDocument;
  onClose: () => void;
};

export function LegalModal({ document: doc, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal modal--legal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Zavřít">
          &times;
        </button>
        <h2 className="modal__title">{doc.title}</h2>
        <div
          className="modal__content"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />
      </div>
    </div>
  );
}
