import type { T } from "../../i18n";
import { footerConfig } from "../../config/footer";
import { asset } from "../../utils/asset";
import { Icon } from "../ui/Icon";
import { handleLinkClick } from "../../hooks/useRoute";
import type { LegalId } from "../../data/legal";

type Props = {
  t: T;
  /** Callback pro otevření právních popupů (obchodní podmínky / GDPR / cookies). */
  onLegalClick?: (id: LegalId) => void;
};

export function Footer({ t, onLegalClick }: Props) {
  const c = footerConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="visually-hidden">{t.footer.heading}</h2>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo-badge">
              <img src={asset(c.logoSrc)} alt={c.brandName} className="footer-logo" />
            </span>
            <p>{c.tagline}</p>
            <div className="footer-socials">
              {c.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={s.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {c.columns.map((col) => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}><a href={l.href} onClick={handleLinkClick}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-col footer-contact">
            <h4>{t.footer.contactTitle}</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="footer-contact-icon" aria-hidden="true"><Icon name="mail" size={16} /></span>
                <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden="true"><Icon name="phone" size={16} /></span>
                <a href={`tel:${c.contact.phone.replace(/\s/g, "")}`}>{c.contact.phone}</a>
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden="true"><Icon name="map-pin" size={16} /></span>
                <span>{c.company.address}</span>
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden="true"><Icon name="clock" size={16} /></span>
                <span>
                  {t.footer.checkInLabel} {c.checkInOut.checkIn} · {t.footer.checkOutLabel} {c.checkInOut.checkOut}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {year} {c.company.name}, {t.footer.icoLabel} {c.company.ico}. {t.footer.rights}
          </div>
          <div className="footer-legal">
            {c.legalLinks.map((l) => {
              // Legal odkazy otevírají popup místo navigace.
              if (l.legal && onLegalClick) {
                const legalId = l.legal;
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onLegalClick(legalId);
                    }}
                  >
                    {l.label}
                  </a>
                );
              }
              return (
                <a key={l.href} href={l.href}>{l.label}</a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
