import { useEffect, useMemo, useState } from "react";
import { AboutSection } from "./components/AboutSection";
import { ContactSection } from "./components/ContactSection";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { DiarySection } from "./components/DiarySection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { Navbar } from "./components/Navbar";
import { ProjectModal } from "./components/ProjectModal";
import { ProjectsSection } from "./components/ProjectsSection";
import { PromoPopup } from "./components/PromoPopup";
import { SEOHead } from "./components/SEOHead";
import { ServicesSection } from "./components/ServicesSection";
import { TrustBar } from "./components/TrustBar";
import { siteContent } from "./data";
import { contentFacade } from "./services/content";
import type { Project } from "./types/content";
import { initAnalytics, disableAnalytics, trackPageView } from "./utils/analytics";
import {
  clearCookieConsent,
  getCookieConsent,
  setCookieConsent,
  type CookieConsentState,
} from "./utils/cookieConsent";
import { getHeroProjectImages } from "./utils/projectImages";
import { ROUTES } from "./config/routes";
import { t } from "./i18n";

function App() {
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const [content, setContent] = useState(siteContent);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [route, setRoute] = useState(() => window.location.hash || ROUTES.home);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [cookieConsent, setCookieConsentState] = useState<CookieConsentState>(() =>
    getCookieConsent(),
  );

  const activePromotions = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return content.promotions.items.filter((promotion) => {
      if (!promotion.enabled) return false;
      if (promotion.startsAt && today < promotion.startsAt) return false;
      if (promotion.endsAt && today > promotion.endsAt) return false;
      return true;
    });
  }, [content.promotions.items]);

  const heroBackgroundImages = useMemo(
    () => getHeroProjectImages(content.projects.items).map((image) => image.src),
    [content.projects.items],
  );

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || ROUTES.home);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const unsubscribe = contentFacade.subscribe(
      siteContent,
      (resolvedContent) => {
        setContent(resolvedContent);
        setIsContentLoading(false);
      },
      () => {
        setContent(siteContent);
        setIsContentLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!gaMeasurementId) return;

    if (cookieConsent === "accepted") {
      initAnalytics(gaMeasurementId);
      return;
    }

    disableAnalytics(gaMeasurementId);
  }, [cookieConsent, gaMeasurementId]);

  useEffect(() => {
    if (cookieConsent !== "accepted" || !gaMeasurementId) return;

    const pagePath = `${window.location.pathname}${window.location.hash || ""}`;
    trackPageView(gaMeasurementId, pagePath, document.title);
  }, [cookieConsent, gaMeasurementId, route]);

  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;

          window.setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 80);

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    reveals.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [content]);

  if (isContentLoading) {
    return (
      <>
        <SEOHead pageId="home" />
        <main className="loading-shell">
          <section className="loading-state">
            <div className="loading-card">
              <img
                src={siteContent.company.logos.color}
                alt={siteContent.company.name}
                className="hero-brand-logo"
              />
              <span className="section-label">{t("loading.eyebrow")}</span>
              <h1>{t("loading.title")}</h1>
              <p>{t("loading.description")}</p>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <SEOHead pageId="home" />
      <Navbar
        companyName={content.company.name}
        logo={content.company.logos.light}
        navigation={content.navigation}
      />
      <main>
        <HeroSection content={content.hero} backgroundImages={heroBackgroundImages} />
        <TrustBar items={content.trustBar} />
        <ServicesSection content={content.services} />
        <AboutSection content={content.about} />
        <ProjectsSection
          content={content.projects}
          onProjectOpen={setSelectedProject}
        />
        <DiarySection content={content.diary} />
        <ContactSection content={content.contact} />
      </main>
      <Footer
        content={content.footer}
        navigation={content.navigation}
        logo={content.company.logos.light}
        onCookieReset={() => {
          clearCookieConsent();
          setCookieConsentState("unset");
        }}
      />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <PromoPopup items={activePromotions} />
      {cookieConsent === "unset" && gaMeasurementId ? (
        <CookieConsentBanner
          onAccept={() => {
            setCookieConsent("accepted");
            setCookieConsentState("accepted");
          }}
          onReject={() => {
            setCookieConsent("rejected");
            setCookieConsentState("rejected");
          }}
        />
      ) : null}
    </>
  );
}

export default App;
