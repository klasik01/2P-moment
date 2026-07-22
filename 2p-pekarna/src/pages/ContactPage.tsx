import type { ContactPageData, InquiryType } from "../types";
import type { Translations } from "../i18n";
import { ContactInfoSection, InquiryFormSection } from "../components/sections";
import { SEOHead } from "../components/ui";

type Props = {
  t: Translations;
  data: ContactPageData;
};

const VALID_TYPES: InquiryType[] = [
  "ubytovani", "sklad", "vyroba", "kancelar", "ostatni",
];

/**
 * Předvybere typ dotazu podle `?typ=` v URL — používají to tlačítka
 * „Poptat komerční prostor" a „Zeptat se na byt".
 */
function typeFromQuery(): InquiryType | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = new URLSearchParams(window.location.search).get("typ");
  return VALID_TYPES.find((type) => type === raw);
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
