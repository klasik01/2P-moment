import type { MediaImage } from "../../services/media";
import type { Translations } from "../../i18n";
import { format } from "../../i18n";
import { Icon } from "./Icon";
import { useLightbox } from "../../hooks/useLightbox";

export type GalleryVariant = "default" | "compact" | "strip";

type Props = {
  images: MediaImage[];
  t: Translations;
  variant?: GalleryVariant;
  /** Stagger reveal animace. Vypni uvnitř modálu. */
  animate?: boolean;
};

/**
 * Galerie s lightboxem. Používá se v plné velikosti na stránce
 * Ubytování, kompaktně u komerčních prostor a jako rolovací pás
 * v detailu bytu.
 */
export function Gallery({ images, t, variant = "default", animate = true }: Props) {
  const { index, isOpen, open, close, prev, next } = useLightbox(images.length);
  const current = index !== null ? images[index] : null;

  // Zamykání stránky i klávesnici řeší useLightbox.
  if (images.length === 0) return null;

  return (
    <div className={`gallery${variant !== "default" ? ` gallery--${variant}` : ""}`}>
      <ul className="gallery__grid" role="list">
        {images.map((img, i) => (
          <li
            key={img.id}
            className={animate ? "reveal" : undefined}
            // Stagger jen v rámci řádku, ať poslední fotky nečekají věčnost.
            style={animate ? ({ "--reveal-i": i % 4 } as React.CSSProperties) : undefined}
          >
            <button
              type="button"
              className="gallery__item"
              onClick={() => open(i)}
              aria-label={`${t.lightbox.open}: ${img.alt}`}
            >
              <img src={img.url} alt={img.alt} loading="lazy" />
            </button>
          </li>
        ))}
      </ul>

      {isOpen && current ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t.unit.galleryTitle}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={close}
            aria-label={t.lightbox.close}
          >
            <Icon name="close" size={20} />
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={prev}
            aria-label={t.lightbox.prev}
          >
            <Icon name="chevron-left" size={24} />
          </button>

          <figure className="lightbox__figure">
            <img src={current.url} alt={current.alt} />
            <figcaption className="lightbox__caption">
              <span>{current.alt}</span>
              <span className="lightbox__counter">
                {format(t.lightbox.counter, {
                  current: (index ?? 0) + 1,
                  total: images.length,
                })}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={next}
            aria-label={t.lightbox.next}
          >
            <Icon name="chevron-right" size={24} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
