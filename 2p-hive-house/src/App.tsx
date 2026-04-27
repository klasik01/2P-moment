import { useEffect, useMemo, useState } from "react";
import { cs } from "./i18n";
import type { CookieConsentState, HomepageData, Promotion } from "./types";
import { getCookieConsent, setCookieConsent } from "./utils/cookieConsent";
import { backend } from "./services";
import { isActive, setActiveProfiles } from "./config/profiles";

import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { useAnalyticsPageView } from "./hooks/useAnalyticsPageView";
import { useBootReady } from "./hooks/useBootReady";
import { useRoute } from "./hooks/useRoute";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Loader } from "./components/ui/Loader";
import { FishingModal } from "./components/modals/FishingModal";
import { VoucherModal } from "./components/modals/VoucherModal";
import { ConstructionModal } from "./components/modals/ConstructionModal";
import { LegalModal } from "./components/modals/LegalModal";
import { CookieConsentBanner } from "./components/overlays/CookieConsentBanner";
import { PromoPopup } from "./components/overlays/PromoPopup";
import { legalDocuments, type LegalId } from "./data/legal";
import { HomePage } from "./pages/HomePage";
import { ReservationPage } from "./pages/ReservationPage";
import { ContactPage } from "./pages/ContactPage";
import { FishingPage } from "./pages/FishingPage";

import homepageData from "./data/homepage.json";

import "./styles/main.scss";

const t = cs;
const data = homepageData as HomepageData;

// Klíče, které musí být "loaded" než aplikace zmizí loaderu.
const REQUIRED_KEYS = ["promotions", "settings"] as const;

function App() {
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadedKeys, setLoadedKeys] = useState<Set<string>>(new Set());
  const [cookieConsent, setCookieConsentState] = useState<CookieConsentState>(() => getCookieConsent());
  const [showFishing, setShowFishing] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showConstruction, setShowConstruction] = useState(false);
  const [legalOpen, setLegalOpen] = useState<LegalId | null>(null);

  const markLoaded = (key: string) => {
    setLoadedKeys((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  };

  // Načtení nastavení aplikace (profily) z Firestore — MUSÍ proběhnout před renderem.
  useEffect(() => {
    backend.fetchAppSettings().then((settings) => {
      setActiveProfiles(settings.activeProfiles);
      // Auto-open construction modal pokud je VE_VYSTAVBE aktivní
      if (settings.activeProfiles.includes("VE_VYSTAVBE")) {
        setShowConstruction(true);
      }
      markLoaded("settings");
    });
  }, []);

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
  const isFishing = route === "/fishing";

  // Profily se čtou až po načtení z Firestore (po isReady)
  const underConstruction = isActive("VE_VYSTAVBE");

  useRevealOnScroll(
    isReservation ? "reservation" :
    isContact ? "contact" :
    isFishing ? "fishing" : "home",
    isReady,
  );
  useAnalyticsPageView(route, cookieConsent, gaMeasurementId);

  if (!isReady) return <Loader t={t} />;

  const onVoucherClick = () => setShowVoucher(true);
  const onConstructionClick = () => setShowConstruction(true);

  return (
    <>
      <Navbar
        t={t}
        onVoucherClick={onVoucherClick}
        onReservationClick={underConstruction ? onConstructionClick : undefined}
      />

      <main>
        {isReservation && !underConstruction ? (
          <ReservationPage data={data} />
        ) : isContact ? (
          <ContactPage />
        ) : isFishing ? (
          <FishingPage onFishingClick={() => setShowFishing(true)} />
        ) : (
          <HomePage
            t={t}
            data={data}
            onVoucherClick={onVoucherClick}
            onFishingClick={() => setShowFishing(true)}
            onConstructionClick={onConstructionClick}
          />
        )}
      </main>

      <Footer t={t} onLegalClick={setLegalOpen} />

      {showFishing && <FishingModal t={t} onClose={() => setShowFishing(false)} />}
      {showVoucher && <VoucherModal t={t} onClose={() => setShowVoucher(false)} />}
      {showConstruction && <ConstructionModal t={t} onClose={() => setShowConstruction(false)} />}
      {legalOpen && (
        <LegalModal
          document={legalDocuments[legalOpen]}
          onClose={() => setLegalOpen(null)}
        />
      )}

      {/* Promo popup jen když NENÍ ve výstavbě */}
      {!underConstruction && <PromoPopup items={activePromotions} t={t} />}

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
