import type { HeroData } from "../../types";
import { handleLinkClick } from "../../hooks/useRoute";

type Props = {
  data: HeroData;
};

export function HeroSection({ data }: Props) {
  if (data.visible === false) return null;

  return (
    <section className="hero" id="hero">
      <div className="hero__inner">
        <p className="hero__subtitle">{data.subtitle}</p>
        <h1 className="hero__title">
          {data.title} <span className="accent">{data.titleAccent}</span>
        </h1>
        <p className="hero__text">{data.text}</p>
        <div className="hero__cta">
          <a
            href={data.ctaPrimaryHref}
            className="btn btn--primary"
            onClick={handleLinkClick}
          >
            {data.ctaPrimaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
