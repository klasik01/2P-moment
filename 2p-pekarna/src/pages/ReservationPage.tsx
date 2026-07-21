import type { ReservationData } from "../types";
import { SEOHead } from "../components/ui";
import { pekarnaConfig } from "../data/pekarna";

type Props = {
  data: ReservationData;
};

/**
 * Rezervace ubytování. Rezervační systém řeší Previo — dokud není
 * v datech vyplněné `previoUrl`, zobrazí se místo iframe kontaktní
 * náhrada, aby stránka nikdy nebyla prázdná.
 */
export function ReservationPage({ data }: Props) {
  const cfg = pekarnaConfig;
  const telHref = `tel:${cfg.contact.phone.replace(/\s/g, "")}`;

  return (
    <>
      <SEOHead meta={data.seo} />

      <section className="reservation section" aria-labelledby="reservation-title">
        <div className="container">
          <header className="section-head">
            <span className="section-eyebrow">{data.eyebrow}</span>
            <h1 id="reservation-title" className="section-title">{data.title}</h1>
            {data.paragraphs.map((p) => (
              <p key={p} className="section-desc">{p}</p>
            ))}
          </header>

          {data.previoUrl ? (
            <div className="reservation__embed">
              <iframe
                src={data.previoUrl}
                title={`Rezervační systém — ${cfg.name}`}
                loading="lazy"
                allow="payment"
              />
            </div>
          ) : (
            <div className="reservation__fallback">
              <h2>{data.fallbackTitle}</h2>
              <p>{data.fallbackText}</p>
              <div className="reservation__actions">
                <a href={telHref} className="btn btn--primary">
                  {data.ctaPhoneLabel} — {cfg.contact.phone}
                </a>
                <a href={`mailto:${cfg.contact.email}`} className="btn btn--ghost">
                  {data.ctaEmailLabel}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
