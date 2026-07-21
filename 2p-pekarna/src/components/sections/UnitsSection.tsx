import type { UnitsData } from "../../types";
import { Icon } from "../ui/Icon";
import { asset } from "../../utils/asset";

type Props = {
  data: UnitsData;
  id?: string;
};

/**
 * Mřížka karet — používá se pro byty na stránce Ubytování
 * i pro typy komerčních prostor.
 */
export function UnitsSection({ data, id = "byty" }: Props) {
  if (data.visible === false) return null;

  const titleId = `${id}-title`;

  return (
    <section className="units section" id={id} aria-labelledby={titleId}>
      <div className="container">
        <header className="section-head">
          <span className="section-eyebrow">{data.eyebrow}</span>
          <h2 id={titleId} className="section-title">{data.title}</h2>
          <p className="section-desc">{data.desc}</p>
        </header>

        <div className="units__grid">
          {data.items.map((unit) => (
            <article key={unit.id} className="unit-card">
              <div className="unit-card__photo">
                <img src={asset(unit.image)} alt={unit.imageAlt} loading="lazy" />
              </div>
              <div className="unit-card__body">
                <p className="unit-card__badge">{unit.badge}</p>
                {unit.name ? <h3 className="unit-card__name">{unit.name}</h3> : null}
                {unit.description ? (
                  <p className="unit-card__desc">{unit.description}</p>
                ) : null}
                {unit.specs?.length ? (
                  <ul className="unit-card__specs" role="list">
                    {unit.specs.map((s) => (
                      <li key={s.label}>
                        <Icon name={s.icon} size={16} />
                        <span>{s.label}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
