import type { ContactData } from "../../types";
import { Icon } from "../ui/Icon";
import { pekarnaConfig } from "../../data/pekarna";

type Props = {
  data: ContactData;
};

/**
 * Kontaktní údaje. Hodnoty se berou z data/pekarna.json, aby byly
 * na jednom místě pro patičku i tuhle stránku — tady jsou jen popisky.
 */
export function ContactInfoSection({ data }: Props) {
  if (data.visible === false) return null;

  const cfg = pekarnaConfig;
  const telHref = `tel:${cfg.contact.phone.replace(/\s/g, "")}`;

  return (
    <section className="contact section" id="kontakt" aria-labelledby="contact-title">
      <div className="container">
        <header className="section-head">
          <span className="section-eyebrow">{data.eyebrow}</span>
          <h2 id="contact-title" className="section-title">{data.title}</h2>
          <p className="section-desc">{data.desc}</p>
        </header>

        <ul className="contact__grid" role="list">
          <li className="contact__card">
            <span className="contact__icon" aria-hidden="true">
              <Icon name="phone" size={22} />
            </span>
            <span className="contact__label">{data.phoneLabel}</span>
            <a className="contact__value" href={telHref}>{cfg.contact.phone}</a>
          </li>

          <li className="contact__card">
            <span className="contact__icon" aria-hidden="true">
              <Icon name="mail" size={22} />
            </span>
            <span className="contact__label">{data.emailLabel}</span>
            <a className="contact__value" href={`mailto:${cfg.contact.email}`}>
              {cfg.contact.email}
            </a>
          </li>

          <li className="contact__card">
            <span className="contact__icon" aria-hidden="true">
              <Icon name="map" size={22} />
            </span>
            <span className="contact__label">{data.addressLabel}</span>
            <span className="contact__value">{cfg.contact.address}</span>
          </li>

          <li className="contact__card">
            <span className="contact__icon" aria-hidden="true">
              <Icon name="office" size={22} />
            </span>
            <span className="contact__label">{data.operatorLabel}</span>
            <span className="contact__value">{cfg.company.name}</span>
          </li>
        </ul>

        {data.mapEmbedUrl ? (
          <div className="contact__map">
            <iframe
              src={data.mapEmbedUrl}
              title={`Mapa — ${cfg.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
