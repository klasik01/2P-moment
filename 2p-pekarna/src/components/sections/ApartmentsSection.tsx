import type { ApartmentsData } from "../../types";
import { Icon } from "../ui/Icon";
import { asset } from "../../utils/asset";
import { handleLinkClick } from "../../hooks/useRoute";

type Props = {
  data: ApartmentsData;
};

export function ApartmentsSection({ data }: Props) {
  if (data.visible === false) return null;

  return (
    <section className="apartments section" id="apartmany" aria-labelledby="apartments-title">
      <div className="container">
        <header className="section-head">
          <span className="section-eyebrow">{data.eyebrow}</span>
          <h2 id="apartments-title" className="section-title">{data.title}</h2>
          <p className="section-desc">{data.desc}</p>
        </header>

        <div className="apartments__grid">
          {data.items.map((apt) => (
            <article key={apt.id} className="apt-card">
              <div className="apt-card__photo">
                <img
                  src={asset(apt.image)}
                  alt={apt.imageAlt}
                  loading="lazy"
                />
              </div>
              <div className="apt-card__body">
                <p className="apt-card__badge">{apt.badge}</p>
                <h3 className="apt-card__name">{apt.name}</h3>
                <p className="apt-card__desc">{apt.description}</p>
                <ul className="apt-card__specs" role="list">
                  {apt.specs.map((s) => (
                    <li key={s.label}>
                      <Icon name={s.icon} size={16} />
                      <span>{s.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          {data.commercial.visible !== false ? (
            <article className="commercial-card">
              <h3>{data.commercial.title}</h3>
              <p>{data.commercial.text}</p>
              <a
                href={data.commercial.ctaHref}
                className="commercial-card__cta"
                onClick={handleLinkClick}
              >
                {data.commercial.ctaLabel}
              </a>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
