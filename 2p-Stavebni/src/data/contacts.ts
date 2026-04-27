/**
 * Customer-facing contact information.
 * Anything a visitor might click or read (phone, email, addresses, hours,
 * on-call info…) belongs here. Components consume this via the higher-level
 * content objects — they never hard-code these values.
 */
/**
 * Otvírací doba kanceláře. Strukturovaná forma (ne "Po–Pá 8–16" string),
 * aby ji bylo možné 1:1 mapovat do schema.org `openingHoursSpecification`
 * bez parseru. `dayOfWeek` hodnoty odpovídají schema.org slovníku
 * (https://schema.org/Monday, Tuesday, ...).
 *
 * Víkend schválně vynechaný – schůzky mimo pracovní hodiny řešíme
 * telefonem, ne veřejně deklarovanou otvírací dobou.
 */
export type OpeningHoursSlot = {
  dayOfWeek: Array<
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
  >;
  opens: string;
  closes: string;
};

export const openingHours: OpeningHoursSlot[] = [
  {
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "16:00",
  },
];

export const contacts = {
  phone: "+420 605 075 324",
  email: "info@2pstavebni.cz",
  addresses: {
    registered: {
      street: "Sadová 240",
      city: "Pacov",
      postalCode: "395 01",
      country: "CZ",
      label: "Sídlo firmy",
    },
    office: {
      street: "Hronova 1078",
      city: "Pacov",
      postalCode: "395 01",
      country: "CZ",
      label: "Provizorní kancelář",
    },
  },
} as const;

/** Full single-line address of the registered office (used in footer). */
export const registeredAddressLine = `${contacts.addresses.registered.street}, ${contacts.addresses.registered.postalCode} ${contacts.addresses.registered.city}`;

/** Multi-line representation used inside the contact block. */
export const companyContactLines = [
  "2P Stavební s.r.o.",
  registeredAddressLine,
  contacts.addresses.registered.label,
];

export const officeContactLines = [
  `${contacts.addresses.office.street}, ${contacts.addresses.office.postalCode} ${contacts.addresses.office.city}`,
  contacts.addresses.office.label,
];
