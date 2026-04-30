import type { HeroData } from "../../types";
import { handleLinkClick } from "../../hooks/useRoute";
import { asset } from "../../utils/asset";

type Props = {
  data: HeroData;
};

export function HeroSection({ data }: Props) {
  if (data.visible === false) return null;

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__text">
            <span className="hero__eyebrow">{data.eyebrow}</span>

            <h1 id="hero-title" className="hero__title">
              {data.title}{" "}
              <span className="accent">{data.titleAccent}</span>
              {data.titleSuffix ? (
                <>
                  <br />
                  {data.titleSuffix}
                </>
              ) : null}
            </h1>

            <p className="hero__lede">{data.text}</p>

            <div className="hero__cta">
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

          <div className="hero__image">
            <img
              src={asset(data.image)}
              alt={data.imageAlt}
              loading="eager"
              fetchPriority="high"
            />
            {data.pills?.length ? (
              <div className="hero__pills">
                {data.pills.map((p) => (
                  <span key={p} className="hero__pill">{p}</span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
