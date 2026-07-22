import { useRef, useState } from "react";
import type { InquiryFormData, InquiryInput, InquiryType } from "../../types";
import type { Translations } from "../../i18n";
import { backend } from "../../services";
import { Section, SectionHead } from "../ui/Section";
import { Button } from "../ui/Button";

type Props = {
  data: InquiryFormData;
  t: Translations;
  /** Předvybraný typ dotazu — např. po prokliku z komerčních prostor. */
  defaultType?: InquiryType;
  /** Override odesílání — jinak se volá backend fasáda. */
  onSubmit?: (payload: InquiryInput) => Promise<void> | void;
};

type Status = "idle" | "sending" | "success" | "error";

export function InquiryFormSection({ data, t, defaultType, onSubmit }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  if (data.visible === false) return null;

  const isSending = status === "sending";
  const isSuccess = status === "success";

  const initialType =
    defaultType && data.inquiryTypes.some((o) => o.value === defaultType)
      ? defaultType
      : data.inquiryTypes[0]?.value;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    const fd = new FormData(form);
    const payload: InquiryInput = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      inquiryType: String(fd.get("inquiryType") ?? "ostatni") as InquiryType,
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    setStatus("sending");
    try {
      if (onSubmit) await onSubmit(payload);
      else await backend.createInquiry(payload);
      setStatus("success");
      // Po 5 sekundách se vrátí do idle a formulář se vyprázdní.
      setTimeout(() => {
        form.reset();
        setStatus("idle");
      }, 5000);
    } catch (err) {
      console.error("[InquiryForm] odeslání selhalo:", err);
      setStatus("error");
    }
  };

  const submitText =
    isSuccess ? data.successLabel :
    isSending ? t.common.sending :
    t.common.submit;

  return (
    <Section id="poptavka" muted labelledBy="form-title">
      <SectionHead
        eyebrow={data.eyebrow}
        title={data.title}
        titleId="form-title"
        paragraphs={data.desc ? [data.desc] : []}
        center
      />

      <form
        ref={formRef}
        className="form reveal"
        noValidate
        onSubmit={handleSubmit}
        aria-busy={isSending}
      >
        <div className="form__grid">
          <div className="form__field">
            <label htmlFor="f-name">
              {data.fields.name} <span className="form__req">*</span>
            </label>
            <input id="f-name" name="name" type="text" required autoComplete="name" />
          </div>

          <div className="form__field">
            <label htmlFor="f-phone">{data.fields.phone}</label>
            <input
              id="f-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+420"
            />
          </div>

          <div className="form__field">
            <label htmlFor="f-email">
              {data.fields.email} <span className="form__req">*</span>
            </label>
            <input id="f-email" name="email" type="email" required autoComplete="email" />
          </div>

          <div className="form__field">
            <label htmlFor="f-type">{data.fields.inquiryType}</label>
            <select id="f-type" name="inquiryType" defaultValue={initialType}>
              {data.inquiryTypes.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="form__field form__field--full">
            <label htmlFor="f-message">{data.fields.message}</label>
            <textarea
              id="f-message"
              name="message"
              rows={5}
              placeholder={data.fields.messagePlaceholder || undefined}
            />
          </div>

          {/* Honeypot — pro člověka neviditelné, bota to láká vyplnit.
              Server takové odeslání tiše zahodí. */}
          <div className="form__honeypot" aria-hidden="true">
            <label htmlFor="f-website">Nevyplňujte toto pole</label>
            <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="form__actions form__field--full">
            <p className="form__note">{data.note}</p>
            <Button type="submit" disabled={isSending || isSuccess}>
              {submitText}
            </Button>
          </div>

          {status === "error" ? (
            <p className="form__error form__field--full" role="alert">
              {t.common.genericError}
            </p>
          ) : null}
        </div>
      </form>
    </Section>
  );
}
