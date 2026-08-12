import type { Translations } from "../../i18n";
import type { FooterData } from "../../types";
import { pekarnaConfig } from "../../data/pekarna";
import { handleLinkClick } from "../../hooks/useRoute";

type Props = {
  t: Translations;
  data: FooterData;
};

export function Footer({ t, data }: Props) {
  const cfg = pekarnaConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h4>{data.brandHeading}</h4>
            <p>{data.brandText}</p>

            {data.group ? (
              <a
                className="footer__group"
                href={data.group.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${data.group.label}: ${data.group.name}`}
              >
                <span className="footer__group-label">{data.group.label}</span>
                <span className="footer__group-logo" aria-hidden="true">
                  2P <span>Moment</span>
                </span>
              </a>
            ) : null}
          </div>

          <div className="footer__col">
            <h4>{data.contactHeading}</h4>
            <ul>
              <li>
                <a href={`tel:${cfg.contact.phone.replace(/\s/g, "")}`}>
                  {cfg.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${cfg.contact.email}`}>{cfg.contact.email}</a>
              </li>
              {cfg.contact.address ? <li>{cfg.contact.address}</li> : null}
            </ul>
          </div>

          <div className="footer__col">
            <h4>{data.navHeading}</h4>
            <ul>
              {data.navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={handleLinkClick}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} {cfg.company.name} — {t.footer.rights}</span>
          <span>{t.footer.icoLabel}: {cfg.company.ico}</span>
        </div>
      </div>
    </footer>
  );
}
