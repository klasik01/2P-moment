import type { ApitherapyData } from "../../types";
import { Icon } from "../ui/Icon";
import { apitherapyData as defaultData } from "../../data/homepage";
import { isActive as profileActive } from "../../config/profiles";

type Props = {
  data?: ApitherapyData;
  id?: string;
};

/**
 * Sekce "Apiterapie — léčivá síla včel".
 * Plug-and-play: bez props vykreslí defaultní obsah z homepage.json.
 */
export function ApitherapySection({ data = defaultData, id = "apiterapie" }: Props) {
  const titleId = `${id}-title`;
  const underConstruction = profileActive("VE_VYSTAVBE");
  return (
    <section className="section-pad apitherapy-section" id={id} aria-labelledby={titleId}>
      <div className="container">
        <div className="hook-grid">
          <div className="reveal-left">
            <div className="section-eyebrow">{data.eyebrow}</div>
            <h2 id={titleId} className="section-title apitherapy-title">
              {data.title} <em>{data.titleAccent}</em>
            </h2>

            <p className="apitherapy-text apitherapy-text-lead">{data.text1}</p>
            <p className="apitherapy-text">{data.text2}</p>

            {!underConstruction && (
              <div className="apitherapy-actions">
                <a href={data.ctaPrimaryHref} className="btn btn-primary">
                  {data.ctaPrimaryLabel}
                </a>
                <a href={data.ctaSecondaryHref} className="btn btn-outline">
                  {data.ctaSecondaryLabel}
                </a>
              </div>
            )}
          </div>

          <div className="hook-visual reveal-right">
            <div className="apitherapy-benefits apitherapy-benefits--sidebar">
              {data.benefits.map((b) => (
                <div key={b.id} className="apitherapy-benefit-card">
                  <div className="apitherapy-benefit-icon" aria-hidden="true">
                    <Icon name={b.icon} size={22} />
                  </div>
                  <p>{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
