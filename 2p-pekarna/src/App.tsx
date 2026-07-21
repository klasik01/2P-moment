import { useState } from "react";
import { cs } from "./i18n";
import type { CookieConsentState, HomepageData } from "./types";
import { getCookieConsent, setCookieConsent } from "./utils/cookieConsent";

import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { useAnalyticsPageView } from "./hooks/useAnalyticsPageView";
import { useRoute } from "./hooks/useRoute";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { LegalModal } from "./components/modals/LegalModal";
import { CookieConsentBanner } from "./components/overlays/CookieConsentBanner";
import { legalDocuments, type LegalId } from "./data/legal";
import { HomePage } from "./pages/HomePage";
import { ReservationPage } from "./pages/ReservationPage";
import { ContactPage } from "./pages/ContactPage";

import homepageData from "./data/homepage.json";

import "./styles/main.scss";

const t = cs;
const data = homepageData as HomepageData;

function App() {
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

  const [cookieConsent, setCookieConsentState] = useState<CookieConsentState>(() => getCookieConsent());
  const [legalOpen, _setLegalOpen] = useState<LegalId | null>(null);

  const route = useRoute();
  const isReservation = route === "/rezervace";
  const isContact = route === "/kontakt";

  // Obsah je statický (data/homepage.json), takže se nečeká na žádná data
  // a stránka se vykreslí hned.
  useRevealOnScroll(
    isReservation ? "reservation" :
    isContact ? "contact" : "home",
    true,
  );
  useAnalyticsPageView(route, cookieConsent, gaMeasurementId);

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
