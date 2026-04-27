/**
 * Legal identifiers of the company – used in contact block, footer and
 * structured data (schema.org).
 */
export const legal = {
  ico: "08318883",
  dic: "CZ08318883",
  registration: "Zapsáno v OR vedeném KS České Budějovice, oddíl C, vložka 29003",
} as const;

export const registrationLine = `IČO: ${legal.ico} | DIČ: ${legal.dic}`;
export const footerLegalLine = `IČO: ${legal.ico} · ${legal.registration}`;
