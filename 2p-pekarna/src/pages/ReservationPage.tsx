import type { ReservationData } from "../types";
import type { Translations } from "../i18n";
import { pekarnaConfig } from "../data/pekarna";
import { Section, SectionHead, SEOHead, Button } from "../components/ui";

type Props = {
  t: Translations;
  data: ReservationData;
};

/**
 * Rezervace ubytování. Rezervační systém řeší Previo — dokud není
 * v datech vyplněné `previoUrl`, zobrazí se místo iframe kontaktní
 * náhrada, aby stránka nikdy nebyla prázdná.
 */
export function ReservationPage({ t, data }: Props) {
  const cfg = pekarnaConfig;
  const telHref = `tel:${cfg.contact.phone.replace(/\s/g, "")}`;

  return (
    <>
      <SEOHead meta={data.seo} />

      <Section className="reservation" labelledBy="reservation-title">
        <SectionHead
          eyebrow={data.eyebrow}
          title={data.title}
          titleId="reservation-title"
          paragraphs={data.paragraphs}
          as="h1"
        />

        {data.previoUrl ? (
          <div className="reservation__embed reveal">
            <iframe
              src={data.previoUrl}
              title={`${t.nav.reserve} — ${cfg.name}`}
              loading="lazy"
              allow="payment"
            />
          </div>
        ) : (
          <div className="reservation__fallback reveal">
            <h2>{data.fallbackTitle}</h2>
            <p>{data.fallbackText}</p>
            <div className="btn-group reservation__actions">
              <Button href={telHref}>
                {data.ctaPhoneLabel} — {cfg.contact.phone}
              </Button>
              <Button href={`mailto:${cfg.contact.email}`} variant="ghost">
                {data.ctaEmailLabel}
              </Button>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
