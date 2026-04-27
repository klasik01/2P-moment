import { SEOHead } from "../components/ui/SEOHead";
import { Icon } from "../components/ui/Icon";
import {
  PageHero,
  FishingCtaBand,
  ContactPanel,
} from "../components/sections";
import { fishingPage } from "../config/fishing";

type Props = {
  onFishingClick: () => void;
};

/**
 * Stránka RYBAŘENÍ — skládá se ze sdíleného PageHero, vlastní info sekce,
 * společného CTA bandu pro povolenku a sdíleného kontaktu.
 */
export function FishingPage({ onFishingClick }: Props) {
  const p = fishingPage;

  const seo = {
    ...p.seo,
    breadcrumbs: [
      { name: "Hive House", url: "https://hivehouse.2pmoment.cz/" },
      { name: "Rybaření" },
    ],
  };

  return (
    <>
      <SEOHead meta={seo} />

      <section className="fishing-page" aria-labelledby="fishing-title">
        <PageHero
          titleId="fishing-title"
          data={p.hero}
          actions={
            <button type="button" className="btn btn-primary" onClick={onFishingClick}>
              {p.cta.buttonLabel}
            </button>
          }
        />

        {/* INFO (editorial + karty) */}
        <section className="fishing-about section-pad">
          <div className="fishing-about-bg" aria-hidden="true">
            <span className="hex hex-a" />
            <span className="hex hex-b" />
          </div>

          <div className="container">
            <div className="fishing-about-head">
              <div className="section-eyebrow">{p.info.eyebrow}</div>
              <h2 className="section-title big-title">
                {p.info.title} <em>{p.info.titleAccent}</em>
              </h2>
              <p className="fishing-about-lead">{p.info.lead}</p>
            </div>

            <div className="fishing-about-grid">
              {p.info.cards.map((c, i) => (
                <article
                  key={c.id}
                  className="fishing-about-card"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="fishing-about-card-icon" aria-hidden="true">
                    <Icon name={c.icon} size={28} />
                  </div>
                  <h3 className="fishing-about-card-title">{c.title}</h3>
                  <p className="fishing-about-card-text">{c.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Povolenka — společný band z homepage */}
        <FishingCtaBand
          data={{ eyebrow: p.cta.eyebrow, title: p.cta.title, desc: p.cta.desc }}
          onClick={onFishingClick}
        />

        {/* Kontakt — sdílená komponenta z homepage */}
        <ContactPanel />
      </section>
    </>
  );
}
