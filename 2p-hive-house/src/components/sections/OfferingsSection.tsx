import { useRef, useState } from "react";
import type { OfferingArticle, OfferingsData } from "../../types";
import { asset } from "../../utils/asset";
import { OfferingArticleModal } from "../modals/OfferingArticleModal";
import { useCarouselAutoRotate } from "../../hooks/useCarouselAutoRotate";
import { offeringsData as defaultData } from "../../data/homepage";

type Props = {
  data?: OfferingsData;
  id?: string;
};

/**
 * Karty nabídek (Glamping / Rybaření / Gastro). Klik otevře modal
 * s článkem, pokud karta má pole `article`.
 * Plug-and-play: bez props vykreslí defaultní obsah z homepage.json.
 */
export function OfferingsSection({ data = defaultData, id = "nabidka" }: Props) {
  const titleId = `${id}-title`;
  // Body lock + ESC řeší <OfferingArticleModal /> přes useModalOpen.
  const [activeArticle, setActiveArticle] = useState<OfferingArticle | null>(null);

  // Filtruj karty podle visible (default true).
  const visibleCards = data.cards.filter((c) => c.visible !== false);

  // Auto-rotace karet na tabletu (768–1023 px) + klikatelné dots.
  // Jednoduchý ping-pong: doprava → doleva → doprava… Žádné zrcadlení DOM.
  const gridRef = useRef<HTMLDivElement | null>(null);
  const carousel = useCarouselAutoRotate(gridRef, [visibleCards.length]);

  return (
    <section className="offerings section-pad" id={id} aria-labelledby={titleId}>
      <div className="container">
        <div className="offerings-head reveal">
          <div>
            <div className="section-eyebrow">{data.sectionEyebrow}</div>
            <h2 id={titleId} className="section-title">
              {data.sectionTitle} <em>{data.sectionTitleAccent}</em>
            </h2>
          </div>
          <p className="section-desc">{data.sectionDesc}</p>
        </div>

        <div className="offerings-grid" ref={gridRef}>
          {visibleCards.map((card, i) => {
            const hasArticle = !!card.article;
            const className = "offerings-card reveal";
            const style = { transitionDelay: `${i * 0.08}s` } as React.CSSProperties;
            const key = card.id;

            const inner = (
              <>
                <div className="offerings-card-media">
                  <img src={asset(card.image)} alt={card.title} loading="lazy" />
                </div>
                <div className="offerings-card-body">
                  <div className="offerings-card-eyebrow">{card.eyebrow}</div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className="offerings-card-cta">{card.ctaLabel}</span>
                </div>
              </>
            );

            return hasArticle ? (
              <button
                key={key}
                type="button"
                className={className}
                style={style}
                aria-label={card.title}
                onClick={() => setActiveArticle(card.article!)}
              >
                {inner}
              </button>
            ) : (
              <a
                key={key}
                href={card.linkHref}
                className={className}
                style={style}
                aria-label={card.title}
              >
                {inner}
              </a>
            );
          })}
        </div>

        {carousel.isActive && carousel.count > 1 && (
          <div className="carousel-dots" role="tablist" aria-label="Navigace kartami">
            {Array.from({ length: carousel.count }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === carousel.activeIndex}
                aria-label={`Karta ${i + 1}`}
                className={`carousel-dot${i === carousel.activeIndex ? " is-active" : ""}`}
                onClick={() => carousel.goTo(i)}
              />
            ))}
          </div>
        )}
      </div>

      {activeArticle && (
        <OfferingArticleModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}
    </section>
  );
}
