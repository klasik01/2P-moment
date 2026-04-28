import type { T } from "../../i18n";

type Props = {
  t: T;
  onAccept: () => void;
  onReject: () => void;
};

export function CookieConsentBanner({ t, onAccept, onReject }: Props) {
  return (
    <div className="cookie-banner" role="alert">
      <div className="cookie-banner__inner">
        <p className="cookie-banner__title">{t.cookies.title}</p>
        <p className="cookie-banner__text">{t.cookies.text}</p>
        <div className="cookie-banner__actions">
          <button className="btn btn--primary" onClick={onAccept}>
            {t.cookies.accept}
          </button>
          <button className="btn btn--secondary" onClick={onReject}>
            {t.cookies.reject}
          </button>
        </div>
      </div>
    </div>
  );
}
