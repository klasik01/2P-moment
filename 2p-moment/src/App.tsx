import { useEffect, useState } from "react";
import { cs } from "./i18n";
import type { CookieConsentState } from "./types";
import { getCookieConsent, setCookieConsent } from "./utils/cookieConsent";
import { backend } from "./services";
import { setActiveProfiles } from "./config/profiles";
import { useBootReady } from "./hooks/useBootReady";
import { useAnalyticsPageView } from "./hooks/useAnalyticsPageView";
import { useRoute } from "./hooks/useRoute";
import { momentConfig } from "./data/moment";

import "./styles/main.scss";

const t = cs;
const cfg = momentConfig;

const REQUIRED_KEYS = ["settings"] as const;

function App() {
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

  const [loadedKeys, setLoadedKeys] = useState<Set<string>>(new Set());
  const [cookieConsent, setCookieConsentState] = useState<CookieConsentState>(() => getCookieConsent());

  const markLoaded = (key: string) => {
    setLoadedKeys((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  };

  useEffect(() => {
    backend.fetchAppSettings().then((settings) => {
      setActiveProfiles(settings.activeProfiles);
      markLoaded("settings");
    });
  }, []);

  const isReady = useBootReady(loadedKeys, REQUIRED_KEYS, 4000);
  const route = useRoute();
  useAnalyticsPageView(route, cookieConsent, gaMeasurementId);

  if (!isReady) {
    return (
      <div className="loader">
        <div className="loader__spinner" />
        <p className="loader__text">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="landing">
      <div className="landing__inner">
        <h1 className="landing__title">
          2P <span className="landing__accent">Moment</span>
        </h1>
        <p className="landing__tagline">{cfg.tagline}</p>
        <div className="landing__divider" />
        <p className="landing__company">{cfg.company.name}</p>
        {cfg.contact.email && (
          <a className="landing__link" href={`mailto:${cfg.contact.email}`}>
            {cfg.contact.email}
          </a>
        )}
        {cfg.contact.phone && (
          <a className="landing__link" href={`tel:${cfg.contact.phone.replace(/\s/g, "")}`}>
            {cfg.contact.phone}
          </a>
        )}
      </div>

      {cookieConsent === "unset" && gaMeasurementId && (
        <div className="cookie-banner">
          <p className="cookie-banner__title">{t.cookies.title}</p>
          <p className="cookie-banner__text">{t.cookies.text}</p>
          <div className="cookie-banner__actions">
            <button className="btn btn--primary" onClick={() => { setCookieConsent("accepted"); setCookieConsentState("accepted"); }}>
              {t.cookies.accept}
            </button>
            <button className="btn btn--secondary" onClick={() => { setCookieConsent("rejected"); setCookieConsentState("rejected"); }}>
              {t.cookies.reject}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
