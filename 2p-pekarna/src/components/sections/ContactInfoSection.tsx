import type { ContactData } from "../../types";
import { pekarnaConfig } from "../../data/pekarna";
import { Section, SectionHead } from "../ui/Section";
import { Icon } from "../ui/Icon";

type Props = {
  data: ContactData;
};

type ContactItem = {
  icon: string;
  label: string;
  value: string;
  href?: string;
};

/**
 * Kontaktní údaje. Hodnoty se berou z data/pekarna.json, aby byly
 * na jednom místě pro patičku i tuhle stránku — tady jsou jen popisky.
 */
export function ContactInfoSection({ data }: Props) {
  if (data.visible === false) return null;

  const cfg = pekarnaConfig;

  const items: ContactItem[] = [
    {
      icon: "phone",
      label: data.phoneLabel,
      value: cfg.contact.phone,
      href: `tel:${cfg.contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: "mail",
      label: data.emailLabel,
      value: cfg.contact.email,
      href: `mailto:${cfg.contact.email}`,
    },
    { icon: "map", label: data.addressLabel, value: cfg.contact.address },
    { icon: "office", label: data.operatorLabel, value: cfg.company.name },
  ];

  return (
    <Section id="kontakt" labelledBy="contact-title">
      <SectionHead
        eyebrow={data.eyebrow}
        title={data.title}
        titleId="contact-title"
        paragraphs={[data.desc]}
        as="h1"
      />

      <ul className="contact-grid" role="list">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="contact-card reveal"
            style={{ "--reveal-i": i } as React.CSSProperties}
          >
            <span className="contact-card__icon" aria-hidden="true">
              <Icon name={item.icon} size={22} />
            </span>
            <span className="contact-card__label">{item.label}</span>
            {item.href ? (
              <a className="contact-card__value" href={item.href}>{item.value}</a>
            ) : (
              <span className="contact-card__value">{item.value}</span>
            )}
          </li>
        ))}
      </ul>

      {data.mapEmbedUrl ? (
        <div className="contact-map reveal">
          <iframe
            src={data.mapEmbedUrl}
            title={`Mapa — ${cfg.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : null}
    </Section>
  );
}
