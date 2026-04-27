import type { T } from "../../i18n";
import { cs } from "../../i18n";
import type { FishingCtaData } from "../../types";
import { fishingCtaData as defaultData } from "../../data/homepage";

type Props = {
  data?: FishingCtaData;
  t?: T;
  onClick: () => void;
  id?: string;
};

/**
 * Sdílený CTA band pro rybářskou povolenku — použitý na homepage i na
 * stránce Rybaření. Plug-and-play: bez `data` vezme defaulty z homepage.json.
 */
export function FishingCtaBand({
  data = defaultData,
  t = cs,
  onClick,
  id = "povolenka",
}: Props) {
  return (
    <section className="section-pad-sm fishing-cta" id={id}>
      <div className="container">
        <div className="section-eyebrow">{data.eyebrow}</div>
        <h2>{data.title}</h2>
        <p className="section-desc">{data.desc}</p>
        <button type="button" className="btn btn-primary" onClick={onClick}>
          {t.common.orderPermit}
        </button>
      </div>
    </section>
  );
}
