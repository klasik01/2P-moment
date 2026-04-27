import { useRef, useState } from "react";
import type { VideoSectionData, VideoCard } from "../../types";
import type { T } from "../../i18n";
import { cs } from "../../i18n";
import { asset } from "../../utils/asset";
import { useModalOpen } from "../../hooks/useModalOpen";
import { useCarouselAutoRotate } from "../../hooks/useCarouselAutoRotate";
import { videoSectionData as defaultData } from "../../data/homepage";
import { isActive } from "../../config/profiles";

type Props = {
  data?: VideoSectionData;
  t?: T;
  id?: string;
};

/**
 * 3-sloupcová mřížka video karet. Klik otevře lightbox s přehrávačem.
 * Plug-and-play: bez props vykreslí defaultní obsah z homepage.json.
 */
export function VideoSection({ data = defaultData, t = cs, id = "videa" }: Props) {
  const titleId = `${id}-title`;
  const [active, setActive] = useState<VideoCard | null>(null);

  // Filtruj karty podle visible (default true).
  const visibleCards = data.cards.filter((c) => c.visible !== false);

  // Auto-rotace karet na tabletu (768–1023 px). Ping-pong, žádné duplikáty.
  const gridRef = useRef<HTMLDivElement | null>(null);
  const carousel = useCarouselAutoRotate(gridRef, [visibleCards.length]);

  // Skryj celou sekci při profilu BEZ_REKLAMY nebo pokud žádná karta není viditelná.
  if (isActive("BEZ_REKLAMY") || visibleCards.length === 0) return null;

  return (
    <section className="video-section section-pad" id={id} aria-labelledby={titleId}>
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
          {visibleCards.map((card, i) => (
            <button
              key={card.id}
              type="button"
              className="offerings-card video-tile reveal"
              style={{ transitionDelay: `${i * 0.08}s` }}
              onClick={() => setActive(card)}
              aria-label={`${card.title} — ${t.common.watchVideo}`}
            >
              <div className="offerings-card-media video-tile-media">
                <img
                  src={asset(card.poster || "/logo.png")}
                  alt={card.title}
                  loading="lazy"
                />
                <span className="video-tile-play" aria-hidden="true">▶</span>
              </div>
              <div className="offerings-card-body">
                <div className="offerings-card-eyebrow">{card.eyebrow}</div>
                <h3>{card.title}</h3>
                <span className="offerings-card-cta">{t.common.watchVideo}</span>
              </div>
            </button>
          ))}
        </div>

        {carousel.isActive && carousel.count > 1 && (
          <div className="carousel-dots" role="tablist" aria-label="Navigace videi">
            {Array.from({ length: carousel.count }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === carousel.activeIndex}
                aria-label={`Video ${i + 1}`}
                className={`carousel-dot${i === carousel.activeIndex ? " is-active" : ""}`}
                onClick={() => carousel.goTo(i)}
              />
            ))}
          </div>
        )}
      </div>

      {active && <VideoLightbox card={active} t={t} onClose={() => setActive(null)} />}
    </section>
  );
}

function VideoLightbox({ card, t, onClose }: { card: VideoCard; t: T; onClose: () => void }) {
  useModalOpen(true, onClose);
  const isMp4 = /\.mp4($|\?)/i.test(card.videoUrl);

  return (
    <div
      className="video-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={card.title}
      onClick={onClose}
    >
      <button className="video-lightbox-close" onClick={onClose} aria-label={t.common.close}>✕</button>
      <div className="video-lightbox-frame" onClick={(e) => e.stopPropagation()}>
        {isMp4 ? (
          <video controls autoPlay poster={card.poster ? asset(card.poster) : undefined}>
            <source src={asset(card.videoUrl)} type="video/mp4" />
          </video>
        ) : (
          <iframe
            src={`${card.videoUrl}${card.videoUrl.includes("?") ? "&" : "?"}autoplay=1`}
            title={card.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
