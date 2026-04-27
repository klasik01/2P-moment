import type { T } from "../../i18n";

type Props = {
  t: T;
  onAccept: () => void;
  onReject: () => void;
};

export function CookieConsentBanner({ t, onAccept, onReject }: Props) {
  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-labelledby="cookie-title">
      <div>
        <h5 id="cookie-title">{t.cookies.title}</h5>
        <p>{t.cookies.text}</p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="btn btn-outline-honey" onClick={onReject}>
          {t.cookies.reject}
        </button>
        <button type="button" className="btn btn-primary" onClick={onAccept}>
          {t.cookies.accept}
        </button>
      </div>
    </div>
  );
}
