import type { InquiryEmailData, InquiryType } from "../../types";
import { format } from "../../i18n";
import { pekarnaConfig } from "../../data/pekarna";
import { Section, SectionHead } from "../ui/Section";
import { Button } from "../ui/Button";

type Props = {
  data: InquiryEmailData;
  /** Předvybraný druh poptávky z ?typ= — určuje předmět a tělo. */
  type?: InquiryType;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Poptávka e-mailem místo formuláře. Klik otevře e-mailový program
 * uživatele (mailto) s předvyplněným příjemcem, předmětem a tělem —
 * nic se neztratí, i když neběží backend.
 */
export function InquiryEmailSection({ data, type }: Props) {
  if (data.visible === false) return null;

  const cfg = pekarnaConfig;
  const to = cfg.contact.email;
  const telHref = `tel:${cfg.contact.phone.replace(/\s/g, "")}`;

  // „ostatni" nemá smysl vpisovat do věty ani předmětu — bereme obecně.
  const option =
    type && type !== "ostatni"
      ? data.inquiryTypes.find((o) => o.value === type)
      : undefined;

  const subject = option
    ? `${data.subjectBase} – ${capitalize(option.label)}`
    : data.subjectBase;
  const body = format(data.bodyTemplate, {
    typ: option ? option.label : "ubytování nebo prostory v Pekárně",
  });

  const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <Section id="poptavka" muted labelledBy="inquiry-title">
      <SectionHead
        eyebrow={data.eyebrow}
        title={data.title}
        titleId="inquiry-title"
        paragraphs={[data.desc]}
        center
      />

      <div className="inquiry-email reveal">
        <div className="btn-group inquiry-email__actions">
          <Button href={mailto}>{data.buttonLabel}</Button>
          <Button href={telHref} variant="ghost">
            {data.callLabel} — {cfg.contact.phone}
          </Button>
        </div>

        <p className="inquiry-email__note">{data.note}</p>
      </div>
    </Section>
  );
}
