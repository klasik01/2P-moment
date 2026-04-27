// ============================================================
// Konfigurace stránky KONTAKT. Jediný zdroj pravdy pro kontakty,
// lidi a firemní údaje. Uprav hodnoty zde.
// ============================================================

export type ContactPerson = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  photo?: string;
};

export type ContactPageConfig = {
  seo: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    ogImage: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    image: string;
    imageAlt: string;
  };
  people: ContactPerson[];
  general: {
    eyebrow: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    checkIn: string;
    checkOut: string;
  };
  company: {
    eyebrow: string;
    title: string;
    name: string;
    ico: string;
    dic?: string;
    dataBox?: string;
    addressLines: string[];
    bankAccount?: string;
    note?: string;
  };
  map: {
    /** URL Google Maps embed (Share → Embed). */
    embedSrc: string;
    title: string;
    /** Otevřít v novém okně. */
    externalHref: string;
  };
};

export const contactPage: ContactPageConfig = {
  seo: {
    title: "Kontakt | Hive House — Hojanovice",
    description:
      "Kontakt na Hive House — glamping se včelami v Hojanovicích na Vysočině. Pavel Pinkas, Jan Pinkas, telefon, e-mail, mapa a fakturační údaje.",
    keywords:
      "kontakt Hive House, Hive House kontakt, Pavel Pinkas, Jan Pinkas, glamping Hojanovice kontakt",
    canonical: "https://hivehouse.2pmoment.cz/kontakt",
    ogImage: "https://hivehouse.2pmoment.cz/og-image.jpg",
  },
  hero: {
    eyebrow: "Kontakt",
    title: "Ozvěte se",
    titleAccent: "rádi vám poradíme",
    lead:
      "Jsme tu pro vás. Napište, zavolejte, nebo se rovnou stavte — poradíme s termínem, apiterapií i rybařením.",
    image: "/picture_2.jpg",
    imageAlt: "Hive House — kontakt",
  },
  people: [
    {
      id: "pavel",
      name: "Pavel Pinkas",
      role: "Majitel · provoz & rezervace",
      phone: "+420 774 110 224",
      email: "pinkas@2pmoment.cz",
    },
    {
      id: "jan",
      name: "Jan Pinkas",
      role: "Provoz & rezervace",
      phone: "+420 737 050 583",
      email: "jan.pinkas@2pmoment.cz",
    },
  ],
  general: {
    eyebrow: "Obecný kontakt",
    title: "Všeobecné dotazy",
    email: "hivehouse@2pmoment.cz",
    phone: "+420 774 110 224",
    address: "Hojanovice 17, 396 01 Hojanovice",
    checkIn: "14:00",
    checkOut: "11:00",
  },
  company: {
    eyebrow: "Fakturace",
    title: "Fakturační údaje",
    name: "2P moment s.r.o.",
    ico: "22395512",
    dic: "CZ22395512",
    dataBox: "2jj2mpz",
    addressLines: ["Hojanovice", "Hojanovice 17, 396 01 Hojanovice", "Česká republika"],
    note: "Společnost zapsaná v obchodním rejstříku vedeném u Krajského soudu v Českých Budějovicích.",
  },
  map: {
    // Výchozí embed na Hojanovice — po upřesnění polohy přepiš.
    embedSrc:
      "https://www.google.com/maps?q=Hojanovice+17&hl=cs&output=embed",
    title: "Mapa — Hive House, Hojanovice",
    externalHref:
      "https://www.google.com/maps/place/Hojanovice+17,+396+01+Hojanovice/@49.5976165,15.2625111,17z/data=!3m1!4b1!4m6!3m5!1s0x470cf9e5b0c0939d:0xba2f1be012dbbc4e!8m2!3d49.5976131!4d15.265086!16s%2Fg%2F11c4jwcxtf?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D",
  },
};
