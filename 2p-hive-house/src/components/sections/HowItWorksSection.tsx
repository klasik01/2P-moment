import { Icon } from "../ui/Icon";
import { howItWorksData as defaultData } from "../../data/homepage";
import {HowItWorksData} from "../../types";

type Props = {
  data?: HowItWorksData;
  id?: string;
};

/**
 * Sekce „Jak to u nás funguje" — 4 kroky v medové časové ose.
 * Plug-and-play: bez props vykreslí defaultní obsah z homepage.json.
 */
export function HowItWorksSection({ data = defaultData, id = "jak-to-funguje" }: Props) {
  const titleId = `${id}-title`;
  return (
    <section className="how-it-works section-pad" id={id} aria-labelledby={titleId}>
      <div className="how-it-works-bg" aria-hidden="true">
        <span className="hex hex-1" />
        <span className="hex hex-2" />
        <span className="hex hex-3" />
      </div>

      <div className="container">
        <div className="how-it-works-head reveal">
          <div className="section-eyebrow">{data.eyebrow}</div>
          <h2 id={titleId} className="section-title big-title">
            {data.title} <em>{data.titleAccent}</em>
          </h2>
          <p className="section-desc">{data.desc}</p>
        </div>

        <ol className="how-steps" aria-label={data.eyebrow}>
          {data.steps.map((s, i) => (
            <li key={s.id} className="how-step reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="how-step-badge" aria-hidden="true">
                <span className="how-step-icon">
                  <Icon name={s.icon} size={28} />
                </span>
                <span className="how-step-num">{s.number}</span>
              </div>
              <div className="how-step-body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
