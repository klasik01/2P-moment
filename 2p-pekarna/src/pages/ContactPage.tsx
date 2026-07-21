import type { ContactPageData, InquiryType } from "../types";
import type { T } from "../i18n";
import { ContactInfoSection, InquiryFormSection } from "../components/sections";
import { SEOHead } from "../components/ui";

type Props = {
  t: T;
  data: ContactPageData;
};

const VALID_TYPES: InquiryType[] = [
  "ubytovani",
  "sklad",
  "vyroba",
  "kancelar",
  "ostatni",
];

/**
 * Předvybere typ dotazu podle `?typ=` v URL — používá to tlačítko
 * „Poptat komerční prostor“, aby uživatel nemusel vybírat znovu.
 */
function typeFromQuery(): InquiryType | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = new URLSearchParams(window.location.search).get("typ");
  return VALID_TYPES.find((t) => t === raw);
}

export function ContactPage({ t, data }: Props) {
  return (
    <>
      <SEOHead meta={data.seo} />
      <ContactInfoSection data={data.contact} />
      <InquiryFormSection data={data.inquiry} t={t} defaultType={typeFromQuery()} />
    </>
  );
}
