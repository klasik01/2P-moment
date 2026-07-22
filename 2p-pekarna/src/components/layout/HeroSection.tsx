import type { HeroData } from "../../types";
import type { Translations } from "../../i18n";
import { media } from "../../services/media";
import { handleLinkClick } from "../../hooks/useRoute";
import { Button } from "../ui/Button";

type Props = {
  data: HeroData;
  t: Translations;
  /** Kotva, na kterou míří náznak scrollování. */
  scrollTo?: string;
};

export function HeroSection({ data, t, scrollTo = "#o-objektu" }: Props) {
  if (data.visible === false) return null;

  const image = media.getImage(data.imageId);

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      {image ? (
        <div className="hero__media">
          <img
            src={image.url}
            alt={image.alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero__scrim" aria-hidden="true" />
        </div>
      ) : null}

      <div className="container hero__inner">
        <div className="hero__content">
          <p className="eyebrow eyebrow--inverse">{data.eyebrow}</p>

          <h1 id="hero-title" className="hero__title">
            {data.title}{" "}
            <span className="accent">{data.titleAccent}</span>
            {data.titleSuffix ? <> {data.titleSuffix}</> : null}
          </h1>

          <p className="hero__lede">{data.text}</p>

          <div className="btn-group">
            <Button href={data.ctaPrimaryHref}>{data.ctaPrimaryLabel}</Button>
            {data.ctaSecondaryLabel && data.ctaSecondaryHref ? (
              <Button href={data.ctaSecondaryHref} variant="inverse">
                {data.ctaSecondaryLabel}
              </Button>
            ) : null}
          </div>

          {data.stats?.length ? (
            <ul className="hero__stats" role="list">
              {data.stats.map((s) => (
                <li key={s.label} className="hero__stat">
                  <span className="hero__stat-num">{s.value}</span>
                  <span className="hero__stat-label">{s.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <a href={scrollTo} className="hero__scroll" onClick={handleLinkClick}>
        {t.hero.scrollHint}
      </a>
    </section>
  );
}
