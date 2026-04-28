export const cs = {
  nav: {
    brandAlt: "2P Moment",
  },
  common: {
    loading: "Načítáme…",
    close: "Zavřít",
    genericError: "Něco se pokazilo, zkuste to prosím znovu.",
    sending: "Odesílám…",
  },
  cookies: {
    title: "Používáme cookies",
    text: "Pro analýzu návštěvnosti používáme Google Analytics. Souhlas můžete kdykoliv odvolat.",
    accept: "Přijmout",
    reject: "Odmítnout",
  },
  profiles: {
    veVystavbe: "Ve výstavbě",
    bezReklamy: "Bez reklamy",
  },
} as const;

export type T = typeof cs;
