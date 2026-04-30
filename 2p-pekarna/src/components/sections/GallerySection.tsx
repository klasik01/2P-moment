import type { GalleryData } from "../../types";
import { Icon } from "../ui/Icon";
import { asset } from "../../utils/asset";
import { useLightbox } from "../../hooks/useLightbox";

type Props = {
  data: GalleryData;
};

export function GallerySection({ data }: Props) {
  if (data.visible === false) return null;

  const { index, isOpen, open, close, prev, next } = useLightbox(data.images.length);
  const currentImage = index !== null ? data.images[index] : null;

  return (
    <section className="gallery section" id="galerie" aria-labelledby="gallery-title">
      <div className="container">
        <header className="section-head">
          <span className="section-eyebrow">{data.eyebrow}</span>
          <h2 id="gallery-title" className="section-title">{data.title}</h2>
          <p className="section-desc">{data.desc}</p>
        </header>

        <ul className="gallery__grid" role="list">
          {data.images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                className="gallery__item"
                onClick={() => open(i)}
                aria-label={`Otevřít fotku: ${img.alt}`}
              >
                <img src={asset(img.src)} alt={img.alt} loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && currentImage ? (
        <div
          className="lightbox is-open"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie fotek"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={close}
            aria-label="Zavřít"
          >
            <Icon name="close" size={20} />
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={prev}
            aria-label="Předchozí"
          >
            <Icon name="chevron-left" size={24} />
          </button>

          <figure className="lightbox__figure">
            <img src={asset(currentImage.src)} alt={currentImage.alt} />
            <figcaption className="lightbox__caption">
              {currentImage.alt}
              <span className="lightbox__counter">
                {(index ?? 0) + 1} / {data.images.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={next}
            aria-label="Další"
          >
            <Icon name="chevron-right" size={24} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
