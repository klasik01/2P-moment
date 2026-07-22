import { useState } from "react";
import type { UnitItem, UnitsData } from "../../types";
import type { Translations } from "../../i18n";
import { media } from "../../services/media";
import { Section, SectionHead } from "../ui/Section";
import { Icon } from "../ui/Icon";
import { UnitDetailModal } from "../modals/UnitDetailModal";

type Props = {
  data: UnitsData;
  t: Translations;
  id?: string;
  muted?: boolean;
};

/** Mřížka karet. Klik na kartu otevře detail s vybavením a galerií. */
export function UnitsSection({ data, t, id = "byty", muted = false }: Props) {
  const [openUnit, setOpenUnit] = useState<UnitItem | null>(null);

  if (data.visible === false) return null;

  const titleId = `${id}-title`;

  return (
    <>
      <Section id={id} muted={muted} labelledBy={titleId}>
        <SectionHead
          eyebrow={data.eyebrow}
          title={data.title}
          titleId={titleId}
          paragraphs={[data.desc]}
        />

        <div className="card-grid">
          {data.items.map((unit, i) => {
            const image = media.getImage(unit.imageId);

            return (
              <button
                key={unit.id}
                type="button"
                className="card card--interactive reveal"
                style={{ "--reveal-i": i } as React.CSSProperties}
                onClick={() => setOpenUnit(unit)}
                aria-haspopup="dialog"
              >
                {image ? (
                  <div className="card__media">
                    <img src={image.url} alt={image.alt} loading="lazy" />
                  </div>
                ) : null}

                <div className="card__body">
                  <p className="card__badge">{unit.badge}</p>
                  {unit.name ? <h3 className="card__title">{unit.name}</h3> : null}
                  {unit.description ? (
                    <p className="card__text">{unit.description}</p>
                  ) : null}

                  {unit.equipment?.length ? (
                    <ul className="card__specs" role="list">
                      {unit.equipment.map((spec) => (
                        <li key={spec.label}>
                          <Icon name={spec.icon} size={16} />
                          <span>{spec.label}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <span className="card__more">
                    {t.unit.detailCta}
                    <Icon name="arrow-right" size={16} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {openUnit ? (
        <UnitDetailModal
          unit={openUnit}
          t={t}
          onClose={() => setOpenUnit(null)}
        />
      ) : null}
    </>
  );
}
