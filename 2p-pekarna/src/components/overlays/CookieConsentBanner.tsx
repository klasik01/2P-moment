import type { Translations } from "../../i18n";
import { Button } from "../ui/Button";

type Props = {
  t: Translations;
  onAccept: () => void;
  onReject: () => void;
};

export function CookieConsentBanner({ t, onAccept, onReject }: Props) {
  return (
    <div className="cookie-banner" role="alert">
      <div className="cookie-banner__inner">
        <div>
          <p className="cookie-banner__title">{t.cookies.title}</p>
          <p className="cookie-banner__text">{t.cookies.text}</p>
        </div>
        <div className="cookie-banner__actions">
          <Button size="sm" onClick={onAccept}>{t.cookies.accept}</Button>
          <Button size="sm" variant="ghost" onClick={onReject}>
            {t.cookies.reject}
          </Button>
        </div>
      </div>
    </div>
  );
}
