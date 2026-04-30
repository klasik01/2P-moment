// České texty (default jazyk).
// Labely tlačítek, systémové / navigační hlášky, popisy modálů.
// Obsah stránek (odstavce, seznamy, CTA na stránce) je v data/homepage.json.

export const cs = {
  nav: {
    brandAlt: "2P Pekárna",
    home: "Úvod",
    about: "O Pekárně",
    apartments: "Apartmány",
    gallery: "Galerie",
    nearby: "Okolí",
    inquiry: "Mám zájem",
    rezervace: "Rezervace",
    kontakt: "Kontakt",
    menu: "Menu",
    closeMenu: "Zavřít menu",
    skipToContent: "Přeskočit na obsah",
    // legacy klíče (zachované, aby nebroke staré kódy)
    uvod: "Úvod",
    ubytovani: "Ubytování",
  },
  hero: {
    scrollHint: "Scroll",
    logoAlt: "2P Pekárna",
  },
  common: {
    close: "Zavřít",
    next: "Další",
    prev: "Zpět",
    loading: "Načítáme…",
    open: "Otevřít",
    reserve: "Rezervovat",
    showMore: "Zobrazit více",
    showLess: "Sbalit",
    sending: "Odesílám…",
    genericError: "Něco se pokazilo, zkuste to prosím znovu.",
    saving: "Ukládám…",
    required: "Povinné",
  },
  cookies: {
    title: "Používáme cookies",
    text:
      "Pro analýzu návštěvnosti a vylepšení stránek používáme Google Analytics. Souhlas můžete kdykoliv odvolat.",
    accept: "Přijmout",
    reject: "Odmítnout",
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
    madeBy: "Vyrobeno s ♥ pro 2P Pekárna.",
    mockupNote: "Mockup verze · připraveno pro 2p-pekarna",
  },
  map: {
    iframeTitle: "Mapa lokality 2P Pekárna",
  },
  reservation: {
    seoTitle: "Rezervace | 2P Pekárna — zarezervujte si svůj termín",
    seoDescription: "Zarezervujte si své ubytování v 2P Pekárna.",
    seoKeywords: "rezervace 2P Pekárna, ubytování, zarezervovat pobyt",
  },
  contact: {
    mapEyebrow: "Kde nás najdete",
    mapTitle: "Naše lokalita",
    mapDesc: "Klikni na mapu pro navigaci.",
    openMaps: "Otevřít v Google Maps",
    companyLabel: "Společnost",
    icoLabel: "IČO",
    dicLabel: "DIČ",
    addressLabel: "Sídlo",
    bankLabel: "Bankovní spojení",
    dataBoxLabel: "Datová schránka",
  },
  lightbox: {
    open: "Otevřít fotku",
    close: "Zavřít",
    prev: "Předchozí",
    next: "Další",
    counter: (n: number, total: number) => `${n} z ${total}`,
  },
} as const;

export type T = typeof cs;
