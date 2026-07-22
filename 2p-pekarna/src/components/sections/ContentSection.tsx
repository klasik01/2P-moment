import type { ContentSectionData } from "../../types";
import { Icon } from "../ui/Icon";
import { asset } from "../../utils/asset";
import { handleLinkClick } from "../../hooks/useRoute";

type Props = {
  data: ContentSectionData;
  /** Podbarvení sekce — pro střídání pruhů na stránce. */
  muted?: boolean;
};

/**
 * Univerzální obsahová sekce — nadpis, text, odrážky, obrázek a CTA.
 * Bez obrázku se sází na jeden sloupec, s obrázkem do dvou.
 */
export function ContentSection({ data, muted = false }: Props) {
  if (data.visible === false) return null;

  const titleId = data.anchor ? `${data.anchor}-title` : undefined;
  const hasImage = Boolean(data.image);

  // Text přijíždí zdola, obrázek z té strany, kde stojí — aby se
  // obě půlky sešly ke středu místo aby jely stejným směrem.
  const imageReveal = data.imageSide === "left" ? "reveal-left" : "reveal-right";

  const body = (
    <div className="content__body reveal">
      {data.eyebrow ? <span className="section-eyebrow">{data.eyebrow}</span> : null}
      <h2 id={titleId} className="section-title">{data.title}</h2>

      {data.paragraphs.map((p) => (
        <p key={p} className="section-desc">{p}</p>
      ))}

      {data.bullets?.length ? (
        <ul className="content__bullets" role="list">
          {data.bullets.map((b) => (
            <li key={b} className="content__bullet">
              <Icon name="check" size={20} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {data.cta || data.ctaSecondary ? (
        <div className="content__cta">
          {data.cta ? (
            <a
              href={data.cta.href}
              className="btn btn--primary"
              onClick={handleLinkClick}
            >
              {data.cta.label}
            </a>
          ) : null}
          {data.ctaSecondary ? (
            <a
              href={data.ctaSecondary.href}
              className="btn btn--ghost"
              onClick={handleLinkClick}
            >
              {data.ctaSecondary.label}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  return (
    <section
      className={`content section${muted ? " content--muted" : ""}`}
      id={data.anchor}
      aria-labelledby={titleId}
    >
      <div className="container">
        {hasImage ? (
          <div
            className={`content__grid${
              data.imageSide === "left" ? " content__grid--image-left" : ""
            }`}
          >
            <div className={`content__image ${imageReveal}`}>
              <img src={asset(data.image!)} alt={data.imageAlt ?? ""} loading="lazy" />
            </div>
            {body}
          </div>
        ) : (
          <div className="content__narrow">{body}</div>
        )}
      </div>
    </section>
  );
}
