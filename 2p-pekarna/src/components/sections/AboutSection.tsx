import type { AboutData } from "../../types";
import { Icon } from "../ui/Icon";
import { asset } from "../../utils/asset";

type Props = {
  data: AboutData;
};

export function AboutSection({ data }: Props) {
  if (data.visible === false) return null;

  return (
    <section className="about section" id="o-pekarne" aria-labelledby="about-title">
      <div className="container">
        <div className="about__grid">
          <div className="about__image">
            <img src={asset(data.image)} alt={data.imageAlt} loading="lazy" />
          </div>

          <div className="about__body">
            <span className="section-eyebrow">{data.eyebrow}</span>
            <h2 id="about-title" className="section-title">{data.title}</h2>
            <p className="section-desc">{data.text}</p>

            {data.features?.length ? (
              <ul className="about__features">
                {data.features.map((f) => (
                  <li key={f} className="about__feature">
                    <Icon name="check" size={22} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
