import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryData } from "../../types";
import { asset } from "../../utils/asset";
import { useModalOpen } from "../../hooks/useModalOpen";
import { galleryData as defaultData } from "../../data/homepage";
import { cs } from "../../i18n";

type Props = {
  data?: GalleryData;
  id?: string;
};

/**
 * Galerie fotek. Mozaika miniatur, klik otevře lightbox (obrázek přes
 * celý viewport, navigace ← → a Escape).
 * Plug-and-play: bez props vezme data z homepage.json.
 */
export function GallerySection({ data = defaultData, id = "galerie" }: Props) {
  const titleId = `${id}-title`;
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const count = data.images.length;

  const close = useCallback(() => setActiveIdx(null), []);
  const prev = useCallback(() => {
    setActiveIdx((i) => (i === null ? null : (i - 1 + count) % count));
  }, [count]);
  const next = useCallback(() => {
    setActiveIdx((i) => (i === null ? null : (i + 1) % count));
  }, [count]);

  return (
    <section className="gallery-section section-pad" id={id} aria-labelledby={titleId}>
      <div className="container">
        <div className="gallery-head reveal">
          <div className="section-eyebrow">{data.eyebrow}</div>
          <h2 id={titleId} className="section-title big-title">
            {data.title} <em>{data.titleAccent}</em>
          </h2>
          {data.desc && <p className="section-desc">{data.desc}</p>}
        </div>

        <div className="gallery-grid">
          {data.images.map((img, i) => (
            <button
              key={i}
              type="button"
              className="gallery-thumb reveal"
              style={{ transitionDelay: `${i * 0.05}s` }}
              onClick={() => setActiveIdx(i)}
              aria-label={img.alt}
            >
              <img src={asset(img.src)} alt={img.alt} loading="lazy" />
              <span className="gallery-thumb-overlay" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      {activeIdx !== null && (
        <GalleryLightbox
          images={data.images}
          index={activeIdx}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}

// ------------------------------------------------------------------

type LightboxProps = {
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function GalleryLightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  useModalOpen(true, onClose);

  // Klávesové šipky
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext]);

  // Swipe na mobilu — horizontální tah ≥ 50 px přepíná obrázek
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    // Ignoruj vertikální gesto (scroll / zavření)
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx > 0) onPrev();
    else onNext();
  };

  const img = images[index];

  return (
    <div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        className="gallery-lightbox-close"
        onClick={onClose}
        aria-label={cs.common.close}
        type="button"
      >
        ✕
      </button>

      {images.length > 1 && (
        <>
          <button
            className="gallery-lightbox-nav gallery-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label={cs.gallery.prev}
            type="button"
          >
            ‹
          </button>
          <button
            className="gallery-lightbox-nav gallery-lightbox-next"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label={cs.gallery.next}
            type="button"
          >
            ›
          </button>
        </>
      )}

      <figure className="gallery-lightbox-frame" onClick={(e) => e.stopPropagation()}>
        <img src={asset(img.src)} alt={img.alt} />
      </figure>

      <div className="gallery-lightbox-counter" aria-hidden="true">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
