import type { T } from "../../i18n";
import type { FooterData } from "../../types";
import { pekarnaConfig } from "../../data/pekarna";
import { handleLinkClick } from "../../hooks/useRoute";

type Props = {
  t: T;
  data?: FooterData;
};

export function Footer({ t, data }: Props) {
  const cfg = pekarnaConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h4>{data?.brandHeading ?? cfg.name}</h4>
            <p>{data?.brandText ?? cfg.tagline}</p>
          </div>

          <div className="footer__col">
            <h4>{data?.contactHeading ?? t.footer.contactTitle}</h4>
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

          {data?.navLinks?.length ? (
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
          ) : null}
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {cfg.company.name} — {t.footer.rights}
          </span>
          <span>{t.footer.mockupNote}</span>
        </div>
      </div>
    </footer>
  );
}
