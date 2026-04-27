// České texty (default jazyk).
// Labely tlačítek, systémové / navigační hlášky, popisy modálů.
// Obsah stránek (odstavce, seznamy, CTA na stránce) je v data/homepage.json.

export const cs = {
  nav: {
    brandAlt: "Hive House",
    uvod: "Úvod",
    vcelin: "Včelín & Glamping",
    ubytovani: "Ubytování",
    fishing: "Rybaření",
    okoli: "Okolí",
    rezervace: "Rezervace",
    kontakt: "Kontakt",
    poukazka: "Koupit poukázku",
    menu: "Menu",
  },
  hero: {
    scrollHint: "Scroll",
    logoAlt: "Hive House",
    slideLabel: "Snímek",
  },
  common: {
    close: "Zavřít",
    next: "Další",
    prev: "Zpět",
    loading: "Načítáme…",
    open: "Otevřít",
    reserve: "Rezervovat",
    orderPermit: "Objednat rybářskou povolenku",
    watchVideo: "Přehrát video",
    showMore: "Zobrazit více",
    showLess: "Sbalit",
    sending: "Odesílám…",
    genericError: "Něco se pokazilo, zkuste to prosím znovu.",
    saving: "Ukládám…",
  },
  cookies: {
    title: "Používáme cookies",
    text:
      "Pro analýzu návštěvnosti a vylepšení stránek používáme Google Analytics. Souhlas můžete kdykoliv odvolat.",
    accept: "Přijmout",
    reject: "Odmítnout",
  },
  fishing: {
    modalTitle: "Rybářská povolenka",
    modalDesc: "Formulář pro objednání rybářské povolenky bude brzy doplněn.",
    soon: "Brzy k dispozici",
    contactInfo: "Pro více informací nás prosím kontaktujte na telefonním čísle",
  },
  voucher: {
    modalTitle: "Koupit poukázku",
    modalDesc: "Formulář pro zakoupení dárkové poukázky bude brzy doplněn.",
    soon: "Brzy k dispozici",
    contactInfo: "Pro více informací nás prosím kontaktujte na telefonním čísle",
  },
  footer: {
    heading: "Patička",
    contactTitle: "Kontakt",
    emailLabel: "E-mail",
    phoneLabel: "Telefon",
    addressLabel: "Adresa",
    checkInLabel: "Check-in",
    checkOutLabel: "Check-out",
    icoLabel: "IČO",
    rights: "Všechna práva vyhrazena.",
    madeBy: "Vyrobeno s ♥ pro Hive House.",
  },
  map: {
    iframeTitle: "Mapa lokality Hive House",
  },
  apitherapy: {
    imageAlt: "Glamping se včelami",
  },
  gallery: {
    prev: "Předchozí",
    next: "Další",
  },
  profiles: {
    label: "Profil:",
    veVystavbe: "Ve výstavbě",
    bezReklamy: "Bez reklamy",
  },
  reservation: {
    seoTitle: "Rezervace | Hive House — zarezervujte si svůj termín",
    seoDescription: "Zarezervujte si svůj pobyt v Hive House. Glamping se včelami v Hojanovicích na Vysočině — vyberte si volný termín online.",
    seoKeywords: "rezervace Hive House, rezervace glamping, zarezervovat pobyt, Hive House termíny",
  },
  contact: {
    mapEyebrow: "Kde nás najdete",
    mapTitle: "Pozemek a okolí",
    mapDesc: "Najdete nás v klidné obci Hojanovice na Vysočině. Klikni na mapu pro navigaci.",
    openMaps: "Otevřít v Google Maps",
    companyLabel: "Společnost",
    icoLabel: "IČO",
    dicLabel: "DIČ",
    addressLabel: "Sídlo",
    bankLabel: "Bankovní spojení",
    dataBoxLabel: "Datová schránka",
  },
} as const;

export type T = typeof cs;
