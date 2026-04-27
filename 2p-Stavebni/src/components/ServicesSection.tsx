import type { ServicesContent } from "../types/content";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";

export function ServicesSection({ content }: { content: ServicesContent }) {
  return (
    <section className="services" id="sluzby">
      <div className="container">
        <div className="services-header">
          <div>
            <SectionHeading
              label={content.label}
              title={content.title}
              titleAccent={content.titleAccent}
            />
          </div>
          <p className="section-desc reveal">{content.description}</p>
        </div>
        <div className="services-grid">
          {content.items.map((service, index) => (
            <article className="service-card reveal" key={service.title}>
              <div className="service-num">{String(index + 1).padStart(2, "0")}</div>
              <div className="service-icon">
                <Icon name={service.icon} size={24} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
