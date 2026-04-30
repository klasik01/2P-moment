import type { NearbyData } from "../../types";
import { Icon } from "../ui/Icon";

type Props = {
  data: NearbyData;
};

export function NearbySection({ data }: Props) {
  if (data.visible === false) return null;

  return (
    <section className="nearby section" id="okoli" aria-labelledby="nearby-title">
      <div className="container">
        <header className="section-head">
          <span className="section-eyebrow">{data.eyebrow}</span>
          <h2 id="nearby-title" className="section-title">{data.title}</h2>
          <p className="section-desc">{data.desc}</p>
        </header>

        <ul className="nearby__grid" role="list">
          {data.items.map((item) => (
            <li key={item.title} className="nearby__card">
              <div className="nearby__icon" aria-hidden="true">
                <Icon name={item.icon} size={22} />
              </div>
              <div className="nearby__body">
                <h3 className="nearby__title">{item.title}</h3>
                <p className="nearby__text">{item.text}</p>
                <span className="nearby__distance">{item.distance}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
