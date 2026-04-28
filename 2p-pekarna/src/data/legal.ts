export type LegalId = "privacy" | "terms";

export const legalDocuments: Record<LegalId, { title: string; content: string }> = {
  privacy: {
    title: "Zásady ochrany osobních údajů",
    content: "<p>Zásady ochrany osobních údajů budou doplněny.</p>",
  },
  terms: {
    title: "Obchodní podmínky",
    content: "<p>Obchodní podmínky budou doplněny.</p>",
  },
};
