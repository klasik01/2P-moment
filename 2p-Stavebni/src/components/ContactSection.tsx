import { t } from "../i18n";
import type { ContactContent } from "../types/content";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";

export function ContactSection({ content }: { content: ContactContent }) {
  return (
    <section className="contact" id="kontakt">
      <div className="container">
        <div className="contact-header">
          <SectionHeading
            label={content.label}
            title={content.title}
            titleAccent={content.titleAccent}
            description={content.description}
          />
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-block reveal">
              <div className="contact-block-title">{t("contact.companyInfoHeading")}</div>
              <div className="contact-line">
                <Icon name="company" size={16} />
                <div>
                  <strong>{content.companyLines[0]}</strong>
                  <br />
                  {content.companyLines[1]}
                  <br />
                  <small>{content.companyLines[2]}</small>
                </div>
              </div>
              <div className="contact-line">
                <Icon name="pin" size={16} />
                <div>
                  {content.officeLines[0]}
                  <br />
                  <small>{content.officeLines[1]}</small>
                </div>
              </div>
              <div className="contact-line">
                <Icon name="building" size={16} />
                <span>{content.registration}</span>
              </div>
              <div className="contact-line">
                <Icon name="phone" size={16} />
                <a href={`tel:${content.phone.replace(/\s+/g, "")}`}>{content.phone}</a>
              </div>
              <div className="contact-line">
                <Icon name="mail" size={16} />
                <a href={`mailto:${content.email}`}>{content.email}</a>
              </div>
            </div>
            <div className="contact-team reveal">
              {content.team.map((member) => (
                <div className="team-card" key={member.email}>
                  <div className="team-avatar">{member.initials}</div>
                  <div className="team-info">
                    <div className="team-name">{member.name}</div>
                    <div className="team-pos">{member.role}</div>
                    <div className="team-contacts">
                      <a
                        href={`tel:${member.phone.replace(/\s+/g, "")}`}
                        className="team-contact-link"
                      >
                        <Icon name="phone" size={13} />
                        {member.phone}
                      </a>
                      <a href={`mailto:${member.email}`} className="team-contact-link">
                        <Icon name="mail" size={13} />
                        {member.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="contact-form-section reveal">
            <h3 className="contact-form-title">{t("contact.directHeading")}</h3>
            <p className="contact-form-desc">{t("contact.directIntro")}</p>
            <div className="contact-quick-actions">
              <a
                href={`tel:${content.phone.replace(/\s+/g, "")}`}
                className="btn btn-primary contact-quick-action"
              >
                <Icon name="phone" size={18} />
                {t("contact.quickCall")}
              </a>
              <a
                href={`mailto:${content.email}`}
                className="btn btn-outline-dark contact-quick-action"
              >
                <Icon name="mail" size={18} />
                {t("contact.quickEmail")}
              </a>
            </div>
            <div className="contact-quick-note">
              <strong>{t("contact.preferDirect")}</strong>
              <p>{t("contact.preferDirectBody")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
