import { useRef, useState } from "react";
import type { InquiryFormData } from "../../types";
import type { T } from "../../i18n";

type Props = {
  data: InquiryFormData;
  t: T;
  onSubmit?: (payload: InquiryFormPayload) => Promise<void> | void;
};

export type InquiryFormPayload = {
  name: string;
  email: string;
  phone: string;
  people: string;
  dateFrom: string;
  dateTo: string;
  rentalType: "short" | "long";
  message: string;
};

type Status = "idle" | "sending" | "success" | "error";

export function InquiryFormSection({ data, t, onSubmit }: Props) {
  if (data.visible === false) return null;

  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const isSending = status === "sending";
  const isSuccess = status === "success";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    const payload: InquiryFormPayload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      people: String(fd.get("people") ?? ""),
      dateFrom: String(fd.get("dateFrom") ?? ""),
      dateTo: String(fd.get("dateTo") ?? ""),
      rentalType: (String(fd.get("rentalType") ?? "short") as "short" | "long"),
      message: String(fd.get("message") ?? ""),
    };

    setStatus("sending");
    try {
      if (onSubmit) await onSubmit(payload);
      setStatus("success");
      // Po 4 sekundách se vrátí do idle a formulář se vyprázdní.
      setTimeout(() => {
        form.reset();
        setStatus("idle");
      }, 4000);
    } catch {
      setStatus("error");
    }
  };

  const submitText =
    isSuccess ? data.successLabel :
    isSending ? t.common.sending :
    data.submitLabel;

  return (
    <section className="form-section section" id="poptavka" aria-labelledby="form-title">
      <div className="container">
        <header className="section-head section-head--center">
          <span className="section-eyebrow">{data.eyebrow}</span>
          <h2 id="form-title" className="section-title">{data.title}</h2>
          <p className="section-desc">{data.desc}</p>
        </header>

        <form
          ref={formRef}
          className="form-card"
          noValidate
          onSubmit={handleSubmit}
          aria-busy={isSending}
        >
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="f-name">
                {data.fields.name} <span className="form-req">*</span>
              </label>
              <input
                id="f-name"
                name="name"
                type="text"
                required
                autoComplete="name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="f-email">
                {data.fields.email} <span className="form-req">*</span>
              </label>
              <input
                id="f-email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="f-phone">{data.fields.phone}</label>
              <input
                id="f-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+420"
              />
            </div>

            <div className="form-field">
              <label htmlFor="f-people">{data.fields.people}</label>
              <input
                id="f-people"
                name="people"
                type="number"
                min={1}
                max={12}
                placeholder="Např. 4"
              />
            </div>

            <div className="form-field">
              <label htmlFor="f-from">{data.fields.dateFrom}</label>
              <input id="f-from" name="dateFrom" type="date" />
            </div>

            <div className="form-field">
              <label htmlFor="f-to">{data.fields.dateTo}</label>
              <input id="f-to" name="dateTo" type="date" />
            </div>

            <div className="form-field form-field--full">
              <span className="form-label">{data.fields.rentalType}</span>
              <div className="form-radio">
                <label>
                  <input
                    type="radio"
                    name="rentalType"
                    value="short"
                    defaultChecked
                  />
                  <span>{data.fields.rentalShort}</span>
                </label>
                <label>
                  <input type="radio" name="rentalType" value="long" />
                  <span>{data.fields.rentalLong}</span>
                </label>
              </div>
            </div>

            <div className="form-field form-field--full">
              <label htmlFor="f-message">{data.fields.message}</label>
              <textarea
                id="f-message"
                name="message"
                rows={4}
                placeholder={data.fields.messagePlaceholder}
              />
            </div>

            <div className="form-actions form-field--full">
              <p className="form-note">{data.note}</p>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSending || isSuccess}
              >
                {submitText}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
