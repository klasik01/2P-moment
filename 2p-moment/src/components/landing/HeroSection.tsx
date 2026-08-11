import type { LandingData } from "../../data/landing";

type Props = {
  data: LandingData["hero"];
};

export function HeroSection({ data }: Props) {
  return (
    <header className="hero" role="banner">
      <div className="hero__inner">
        <span className="hero__eyebrow">{data.eyebrow}</span>
        <h1 className="hero__brand">
          2P <span className="hero__accent">Moment</span>
        </h1>
        <p className="hero__statement">{data.statement}</p>
        <span className="hero__hint" aria-hidden="true">{data.hint}</span>
      </div>
    </header>
  );
}
