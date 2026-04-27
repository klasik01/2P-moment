import type { LegalDocument, LegalParagraph } from "../../data/legal";
import { cs } from "../../i18n";
import { useModalOpen } from "../../hooks/useModalOpen";

type Props = {
  document: LegalDocument;
  onClose: () => void;
};

/**
 * Znovupoužitelný modal pro právní dokumenty (obchodní podmínky,
 * ochrana osobních údajů, cookies).
 *
 * Obsah přichází z `src/data/legal.ts`. Modal podporuje:
 *  - nadpis + podtitul + datum poslední revize,
 *  - libovolný počet sekcí s volitelným nadpisem,
 *  - odstavce (plain text) i odrážkové seznamy (list / ordered).
 *
 * UX:
 *  - Klik na backdrop nebo ESC zavírá modal (useModalOpen).
 *  - Scrollovatelný obsah — dokumenty jsou delší.
 *  - Focus je na close tlačítku pro klávesnicové uživatele.
 */
export function LegalModal({ document, onClose }: Props) {
  useModalOpen(true, onClose);
  const titleId = `legal-title-${document.id}`;

  return (
    <div
      className="modal-backdrop legal-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div className="modal legal-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label={cs.common.close}
          autoFocus
        >
          ✕
        </button>

        <header className="legal-modal-header">
          <h2 id={titleId} className="legal-modal-title">{document.title}</h2>
          {document.subtitle && <p className="legal-modal-subtitle">{document.subtitle}</p>}
          <p className="legal-modal-updated">
            Platné od {formatDate(document.updatedAt)}
          </p>
        </header>

        <div className="legal-modal-body">
          {document.sections.map((section, i) => (
            <section key={i} className="legal-modal-section">
              {section.heading && (
                <h3 className="legal-modal-section-title">{section.heading}</h3>
              )}
              {section.paragraphs.map((p, j) => (
                <LegalContent key={j} content={p} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegalContent({ content }: { content: LegalParagraph }) {
  if (typeof content === "string") {
    return <p className="legal-modal-paragraph">{content}</p>;
  }
  if ("list" in content) {
    return (
      <ul className="legal-modal-list">
        {content.list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  if ("ordered" in content) {
    return (
      <ol className="legal-modal-list legal-modal-list-ordered">
        {content.ordered.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    );
  }
  return null;
}

function formatDate(iso: string): string {
  // iso je ve formátu YYYY-MM-DD — převedeme na D. M. YYYY (česky)
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  if (!y || !m || !d) return iso;
  return `${d}. ${m}. ${y}`;
}
