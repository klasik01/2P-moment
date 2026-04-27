import { t } from "../i18n";

type CookieConsentBannerProps = {
  onAccept: () => void;
  onReject: () => void;
};

export function CookieConsentBanner({
  onAccept,
  onReject,
}: CookieConsentBannerProps) {
  return (
    <aside className="cookie-banner" aria-label={t("cookies.label")}>
      <div className="cookie-banner-copy">
        <strong>{t("cookies.headline")}</strong>
        <p>{t("cookies.body")}</p>
      </div>
      <div className="cookie-banner-actions">
        <button type="button" className="btn btn-secondary" onClick={onReject}>
          {t("cookies.reject")}
        </button>
        <button type="button" className="btn btn-primary" onClick={onAccept}>
          {t("cookies.accept")}
        </button>
      </div>
    </aside>
  );
}
