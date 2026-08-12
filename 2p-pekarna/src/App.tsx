import { useState } from "react";
import { getTranslations } from "./i18n";
import type {
  AboutPageData,
  AccommodationPageData,
  CommercialPageData,
  ContactPageData,
  CookieConsentState,
  HomepageData,
  ReservationData,
} from "./types";
import { getCookieConsent, setCookieConsent } from "./utils/cookieConsent";
import { wasIntroSeen, markIntroSeen, isHomepage, cameFromExternalDomain } from "./utils/introVideo";

import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { useAnalyticsPageView } from "./hooks/useAnalyticsPageView";
import { useRoute } from "./hooks/useRoute";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { LegalModal } from "./components/modals";
import { CookieConsentBanner, IntroVideoModal } from "./components/overlays";
import { legalDocuments, type LegalId } from "./data/legal";
import { pekarnaConfig } from "./data/pekarna";

import { HomePage } from "./pages/HomePage";
import { AccommodationPage } from "./pages/AccommodationPage";
import { CommercialPage } from "./pages/CommercialPage";
import { AboutPage } from "./pages/AboutPage";
import { ReservationPage } from "./pages/ReservationPage";
import { ContactPage } from "./pages/ContactPage";

import homepageJson from "./data/homepage.json";
import accommodationJson from "./data/accommodation.json";
import commercialJson from "./data/commercial.json";
import aboutJson from "./data/about.json";
import contactJson from "./data/contact.json";
import reservationJson from "./data/reservation.json";

import "./styles/main.scss";

const t = getTranslations();

const homepage = homepageJson as HomepageData;
const accommodation = accommodationJson as AccommodationPageData;
const commercial = commercialJson as CommercialPageData;
const about = aboutJson as AboutPageData;
const contact = contactJson as ContactPageData;
const reservation = reservationJson as ReservationData;

function App() {
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

  const [cookieConsent, setCookieConsentState] =
    useState<CookieConsentState>(() => getCookieConsent());
  const [legalOpen, setLegalOpen] = useState<LegalId | null>(null);

  // Uvítací video — jen při příchodu (ne po refreshi), když je zapnuté
  // v configu a je nastavený zdroj.
  const introSrc = pekarnaConfig.introVideo;
  const introEnabled = pekarnaConfig.introVideoEnabled !== false && Boolean(introSrc);
  const introTtlMs = (pekarnaConfig.introVideoTtlMinutes ?? 60) * 60_000;
  const introExternalOnly = pekarnaConfig.introVideoExternalOnly === true;
  // Úvodní stránka + vypršelý cooldown; případně navíc příchod z cizí domény.
  // `?intro` v URL vynutí náhled (obejde vše) — pro testování.
  const [showIntro, setShowIntro] = useState(() => {
    if (!introSrc) return false;
    const forced =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("intro");
    if (forced) return true;
    if (!introEnabled || !isHomepage()) return false;
    if (introExternalOnly && !cameFromExternalDomain()) return false;
    return !wasIntroSeen(introTtlMs);
  });

  const route = useRoute();

  // Obsah je statický, takže se nečeká na žádná data a stránka
  // se vykreslí hned.
  useRevealOnScroll(route, true);
  useAnalyticsPageView(route, cookieConsent, gaMeasurementId);

  const renderPage = () => {
    switch (route) {
      case "/ubytovani":
        return <AccommodationPage t={t} data={accommodation} />;
      case "/komercni-prostory":
        return <CommercialPage t={t} data={commercial} />;
      case "/o-pekarne":
        return <AboutPage data={about} />;
      case "/rezervace":
        return <ReservationPage t={t} data={reservation} />;
      case "/kontakt":
        return <ContactPage data={contact} />;
      default:
        return <HomePage t={t} data={homepage} />;
    }
  };

  return (
    <>
      <a href="#main" className="skip-link">{t.nav.skipToContent}</a>

      <Navbar t={t} />

      {/* Hlavička je fixed — na úvodní stránce leží na hero fotce,
          jinde musí obsah dostat odsazení, aby pod ni nezajel. */}
      <main id="main" className={route === "/" ? undefined : "main--offset"}>
        {renderPage()}
      </main>

      <Footer t={t} data={homepage.footer} />

      {legalOpen ? (
        <LegalModal
          document={legalDocuments[legalOpen]}
          t={t}
          onClose={() => setLegalOpen(null)}
        />
      ) : null}

      {cookieConsent === "unset" && gaMeasurementId ? (
        <CookieConsentBanner
          t={t}
          onAccept={() => { setCookieConsent("accepted"); setCookieConsentState("accepted"); }}
          onReject={() => { setCookieConsent("rejected"); setCookieConsentState("rejected"); }}
        />
      ) : null}

      {showIntro && introSrc ? (
        <IntroVideoModal
          src={introSrc}
          t={t}
          onClose={() => { markIntroSeen(); setShowIntro(false); }}
        />
      ) : null}
    </>
  );
}

export default App;
