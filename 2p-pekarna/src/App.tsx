import { useEffect, useMemo, useState } from "react";
import { cs } from "./i18n";
import type { CookieConsentState, HomepageData, Promotion } from "./types";
import { getCookieConsent, setCookieConsent } from "./utils/cookieConsent";
import { backend } from "./services";

import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { useAnalyticsPageView } from "./hooks/useAnalyticsPageView";
import { useBootReady } from "./hooks/useBootReady";
import { useRoute } from "./hooks/useRoute";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Loader } from "./components/ui/Loader";
import { LegalModal } from "./components/modals/LegalModal";
import { CookieConsentBanner } from "./components/overlays/CookieConsentBanner";
import { PromoPopup } from "./components/overlays/PromoPopup";
import { legalDocuments, type LegalId } from "./data/legal";
import { HomePage } from "./pages/HomePage";
import { ReservationPage } from "./pages/ReservationPage";
import { ContactPage } from "./pages/ContactPage";

import homepageData from "./data/homepage.json";

import "./styles/main.scss";

const t = cs;
const data = homepageData as HomepageData;

// Klíče, které musí být "loaded" než aplikace zmizí loaderu.
const REQUIRED_KEYS = ["promotions"] as const;

function App() {
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadedKeys, setLoadedKeys] = useState<Set<string>>(new Set());
  const [cookieConsent, setCookieConsentState] = useState<CookieConsentState>(() => getCookieConsent());
  const [legalOpen, _setLegalOpen] = useState<LegalId | null>(null);

  const markLoaded = (key: string) => {
    setLoadedKeys((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  };

  // Sezónní akce — subscribe z Firestore.
  useEffect(() => {
    const unsub = backend.subscribePromotions(
      (promos) => { setPromotions(promos); markLoaded("promotions"); },
      () => { setPromotions([]); markLoaded("promotions"); },
    );
    return () => unsub();
  }, []);

  const activePromotions = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return promotions.filter((p) => {
      if (!p.enabled) return false;
      if (p.startsAt && today < p.startsAt) return false;
      if (p.endsAt && today > p.endsAt) return false;
      return true;
    });
  }, [promotions]);

  const isReady = useBootReady(loadedKeys, REQUIRED_KEYS, 4000);
  const route = useRoute();
  const isReservation = route === "/rezervace";
  const isContact = route === "/kontakt";

  useRevealOnScroll(
    isReservation ? "reservation" :
    isContact ? "contact" : "home",
    isReady,
  );
  useAnalyticsPageView(route, cookieConsent, gaMeasurementId);

  if (!isReady) return <Loader t={t} />;

  return (
    <>
      <a href="#main" className="skip-link">{t.nav.skipToContent}</a>

      <Navbar t={t} />

      <main id="main">
        {isReservation ? (
          <ReservationPage data={data} />
        ) : isContact ? (
          <ContactPage />
        ) : (
          <HomePage t={t} data={data} />
        )}
      </main>

      <Footer t={t} data={data.footer} />

      {legalOpen && (
        <LegalModal
          document={legalDocuments[legalOpen]}
          onClose={() => _setLegalOpen(null)}
        />
      )}

      <PromoPopup items={activePromotions} t={t} />

      {cookieConsent === "unset" && gaMeasurementId && (
        <CookieConsentBanner
          t={t}
          onAccept={() => { setCookieConsent("accepted"); setCookieConsentState("accepted"); }}
          onReject={() => { setCookieConsent("rejected"); setCookieConsentState("rejected"); }}
        />
      )}
    </>
  );
}

export default App;
