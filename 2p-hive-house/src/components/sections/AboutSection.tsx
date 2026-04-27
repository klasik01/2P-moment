import type { AboutData } from "../../types";
import { Icon } from "../ui/Icon";
import { aboutData as defaultData } from "../../data/homepage";

type Props = {
  /** Přepsání dat; nepovinné — výchozí data jdou z homepage.json. */
  data?: AboutData;
  /** Override ID sekce (pro případ více instancí na stránce). */
  id?: string;
};

/**
 * Sekce „O Hive House" — editorial intro + 3 Q&A bloky.
 * Plug-and-play: bez props vykreslí defaultní obsah z homepage.json.
 */
export function AboutSection({ data = defaultData, id = "o-nas" }: Props) {
  const titleId = `${id}-title`;
  return (
    <section className="about-section section-pad" id={id} aria-labelledby={titleId}>
      <div className="about-section-bg" aria-hidden="true">
        <span className="hex hex-a" />
        <span className="hex hex-b" />
      </div>

      <div className="container">
        <div className="about-head reveal">
          <div className="section-eyebrow">{data.eyebrow}</div>
          <h2 id={titleId} className="section-title big-title">
            {data.title} <em>{data.titleAccent}</em>
          </h2>
          <p className="about-lead">{data.lead}</p>
        </div>

        <div className="about-grid">
          {data.blocks.map((b, i) => (
            <article key={b.id} className="about-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="about-card-icon" aria-hidden="true">
                <Icon name={b.icon} size={28} />
              </div>
              <h3 className="about-card-question">{b.question}</h3>
              <p className="about-card-answer">{b.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
