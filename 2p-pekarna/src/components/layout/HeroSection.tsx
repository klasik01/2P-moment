import type { HeroData } from "../../types";
import type { T } from "../../i18n";
import { handleLinkClick } from "../../hooks/useRoute";
import { asset } from "../../utils/asset";

type Props = {
  data: HeroData;
  t: T;
  /** Kotva, na kterou míří náznak scrollování. */
  scrollTo?: string;
};

export function HeroSection({ data, t, scrollTo = "#o-objektu" }: Props) {
  if (data.visible === false) return null;

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <img
          src={asset(data.image)}
          alt={data.imageAlt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero__scrim" aria-hidden="true" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">{data.eyebrow}</p>

          <h1 id="hero-title" className="hero__title">
            {data.title}{" "}
            <span className="accent">{data.titleAccent}</span>
            {data.titleSuffix ? <> {data.titleSuffix}</> : null}
          </h1>

          <p className="hero__lede">{data.text}</p>

          <div className="hero__actions">
            <a
              href={data.ctaPrimaryHref}
              className="btn btn--primary"
              onClick={handleLinkClick}
            >
              {data.ctaPrimaryLabel}
            </a>
            {data.ctaSecondaryLabel && data.ctaSecondaryHref ? (
              <a
                href={data.ctaSecondaryHref}
                className="btn btn--ghost"
                onClick={handleLinkClick}
              >
                {data.ctaSecondaryLabel}
              </a>
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
