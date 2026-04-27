import type { FaqContent } from "../types/content";
import { SectionHeading } from "./SectionHeading";

/**
 * Viditelná FAQ sekce – sdílí zdroj pravdy s FAQPage JSON-LD schema
 * přes `data/pages/home/faq.ts` (který reexportuje items z
 * `data/seo/faq.ts`). Shoda markup ↔ viditelného obsahu je podmínka
 * Google FAQ rich result.
 *
 * Používá nativní `<details>/<summary>` pattern:
 *  - keyboard accessibility zdarma (Enter/Space = toggle)
 *  - správné ARIA (`aria-expanded` řídí prohlížeč)
 *  - funguje i bez JS (progressive enhancement)
 *  - atribut `name` (HTML 2023+) vytvoří accordion skupinu
 */
export function FaqSection({ content }: { content: FaqContent }) {
  return (
    <section className="faq" id="caste-otazky">
      <div className="container">
        <div className="faq-header">
          <SectionHeading
            label={content.label}
            title={content.title}
            titleAccent={content.titleAccent}
            description={content.description}
          />
        </div>
        <div className="faq-list">
          {content.items.map((entry, index) => (
            <details
              className="faq-item reveal"
              key={entry.question}
              name="faq-2p-stavebni"
              open={index === 0}
            >
              <summary className="faq-question">
                <span className="faq-question-text">{entry.question}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <div className="faq-answer">{entry.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
