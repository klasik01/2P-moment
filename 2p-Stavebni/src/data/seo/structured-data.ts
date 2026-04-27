import { businessProfiles } from "../business-profiles";
import { company } from "../company";
import { contacts, openingHours } from "../contacts";
import { legal } from "../legal";
import { services as servicesData } from "../pages/home/services";
import { socials } from "../socials";
import { CONTACT_PHONE_RAW, SITE_URL } from "./defaults";
import { faq } from "./faq";

/**
 * Union sociálních profilů a business directories pro schema.org sameAs.
 * Zdroj URL: `data/socials.ts` (social profiles) + `data/business-profiles.ts`
 * (veřejné firemní profily). Drženo v datech, ne v builderu, aby šlo
 * texty upravovat bez zásahu do schema logiky.
 */
const ALL_SAME_AS: string[] = [
  ...socials.map((social) => social.href),
  ...businessProfiles.map((profile) => profile.href),
];

/**
 * All JSON-LD builders. They return plain JS objects – the SEOHead component
 * serializes them. Keep business facts DRY by composing from the shared
 * data modules (company, contacts, legal, socials).
 */

type JsonLd = Record<string, unknown>;

const addressSchema = {
  "@type": "PostalAddress",
  streetAddress: contacts.addresses.registered.street,
  addressLocality: contacts.addresses.registered.city,
  postalCode: contacts.addresses.registered.postalCode,
  addressCountry: contacts.addresses.registered.country,
};

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: company.legalName,
    alternateName: company.name,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/assets/images/logo-02.png`,
    telephone: CONTACT_PHONE_RAW,
    email: contacts.email,
    address: addressSchema,
    taxID: legal.dic,
    vatID: legal.dic,
    sameAs: ALL_SAME_AS,
  };
}

export function localBusinessSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "GeneralContractor"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: company.legalName,
    alternateName: company.name,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/assets/images/projects/6/1.jpg`,
    logo: `${SITE_URL}/assets/images/logo-02.png`,
    telephone: CONTACT_PHONE_RAW,
    email: contacts.email,
    priceRange: "$$",
    address: addressSchema,
    // Otvírací doba – datový zdroj `openingHours` v `data/contacts.ts`
    // 1:1 mapujeme do schema.org OpeningHoursSpecification. Víkend
    // záměrně vynecháván (schůzky po domluvě telefonem).
    openingHoursSpecification: openingHours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.dayOfWeek,
      opens: slot.opens,
      closes: slot.closes,
    })),
    // ContactPoint – voice asistent ("Zavolejte 2P Stavební") získá
    // jednoznačný kanál i jazyk.
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: CONTACT_PHONE_RAW,
        email: contacts.email,
        contactType: "customer service",
        areaServed: "CZ",
        availableLanguage: ["Czech", "cs-CZ"],
      },
    ],
    areaServed: [
      { "@type": "AdministrativeArea", name: "Kraj Vysočina" },
      { "@type": "City", name: "Pacov" },
      { "@type": "City", name: "Pelhřimov" },
      { "@type": "City", name: "Humpolec" },
    ],
    sameAs: ALL_SAME_AS,
    makesOffer: servicesData.items.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
    })),
  };
}

export function websiteSchema(title: string, description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: title,
    description,
    inLanguage: "cs-CZ",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function speakableSchema(cssSelectors: string[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    cssSelector: cssSelectors,
  };
}

/**
 * CSS selektory, které mají hlasoví asistenti (Google Assistant, Siri přes
 * Applebot-Extended) přednostně předčítat při voice search dotazech.
 * Cílíme na H1, hero perex, eyebrow + otázky a odpovědi FAQ.
 */
const HOME_SPEAKABLE_SELECTORS = [
  "h1",
  ".hero-desc",
  ".section-label",
  ".faq-question",
  ".faq-answer",
];

/** Aggregate all JSON-LD blocks meant to be injected on the home page. */
export function homeJsonLdBlocks(title: string, description: string): JsonLd[] {
  return [
    organizationSchema(),
    localBusinessSchema(),
    websiteSchema(title, description),
    breadcrumbSchema([{ name: "Úvod", url: `${SITE_URL}/` }]),
    faqSchema(),
    speakableSchema(HOME_SPEAKABLE_SELECTORS),
  ];
}
