import type { ContentSectionData } from "../../types";
import { media } from "../../services/media";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";

type Props = {
  data: ContentSectionData;
  /** Teplejší podklad — pro odlišení sousedních sekcí. */
  muted?: boolean;
};

/**
 * Obsahová sekce. Obrázek text obtéká (float), takže odstavce
 * vyplní prostor vedle něj i pod ním — místo dvou sloupců, kde
 * jeden zbytečně končí dřív.
 *
 * Nadpis jde vždy přes celou šířku, ať se neláme do úzkého proužku.
 */
export function ContentSection({ data, muted = false }: Props) {
  if (data.visible === false) return null;

  const titleId = data.anchor ? `${data.anchor}-title` : undefined;
  const image = data.imageId ? media.getImage(data.imageId) : undefined;

  // Obrázek přijíždí z té strany, kde stojí — aby se s textem
  // sešly ke středu místo aby jely stejným směrem.
  const imageReveal = data.imageSide === "left" ? "reveal-left" : "reveal-right";

  return (
    <section
      className={`content section${muted ? " section--muted" : ""}`}
      id={data.anchor}
      aria-labelledby={titleId}
    >
      <div className="container">
        <div className={`content__layout${image ? "" : " content__layout--narrow"}`}>
          <header className="content__head reveal">
            {data.eyebrow ? <span className="eyebrow">{data.eyebrow}</span> : null}
            <h2 id={titleId} className="title">{data.title}</h2>
          </header>

          {image ? (
            <figure
              className={`content__image ${imageReveal}${
                data.imageSide === "left" ? " content__image--left" : ""
              }`}
            >
              <img src={image.url} alt={image.alt} loading="lazy" />
            </figure>
          ) : null}

          {data.paragraphs.map((p) => (
            <p key={p} className="prose reveal">{p}</p>
          ))}

          {data.bullets?.length ? (
            <ul className="content__bullets reveal" role="list">
              {data.bullets.map((b) => (
                <li key={b} className="content__bullet">
                  <Icon name="check" size={20} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {data.cta || data.ctaSecondary ? (
            <div className="btn-group content__cta reveal">
              {data.cta ? (
                <Button href={data.cta.href}>{data.cta.label}</Button>
              ) : null}
              {data.ctaSecondary ? (
                <Button href={data.ctaSecondary.href} variant="ghost">
                  {data.ctaSecondary.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
