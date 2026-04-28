import type { T } from "../../i18n";
import { pekarnaConfig } from "../../data/pekarna";

type Props = {
  t: T;
};

export function Footer({ t }: Props) {
  const cfg = pekarnaConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__contact">
          <h3>{t.footer.contactTitle}</h3>
          <p>
            <strong>{t.footer.emailLabel}:</strong>{" "}
            <a href={`mailto:${cfg.contact.email}`}>{cfg.contact.email}</a>
          </p>
          <p>
            <strong>{t.footer.phoneLabel}:</strong>{" "}
            <a href={`tel:${cfg.contact.phone.replace(/\s/g, "")}`}>{cfg.contact.phone}</a>
          </p>
          {cfg.contact.address && (
            <p>
              <strong>{t.footer.addressLabel}:</strong> {cfg.contact.address}
            </p>
          )}
        </div>

        <div className="footer__bottom">
          <p>
            &copy; {year} {cfg.company.name} &middot; {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
