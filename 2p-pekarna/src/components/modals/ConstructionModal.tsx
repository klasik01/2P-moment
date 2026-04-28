import { useState } from "react";
import type { T } from "../../i18n";
import { constructionConfig } from "../../config/profiles";
import { backend } from "../../services";

type Props = {
  t: T;
  onClose: () => void;
};

export function ConstructionModal({ t, onClose }: Props) {
  const cfg = constructionConfig;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("sending");
    try {
      await backend.createSubscription({ email, source: "construction-popup" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label={t.common.close}>
          &times;
        </button>

        <h2 className="modal__title">{cfg.popupTitle}</h2>
        <p className="modal__text">{cfg.popupText}</p>

        {status === "success" ? (
          <p className="modal__success">{cfg.popupSuccessMessage}</p>
        ) : (
          <form className="modal__form" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={cfg.popupEmailPlaceholder}
              required
              disabled={status === "sending"}
            />
            <button
              type="submit"
              className="btn btn--primary"
              disabled={status === "sending"}
            >
              {status === "sending" ? t.common.sending : cfg.popupCtaLabel}
            </button>
            {status === "error" && (
              <p className="modal__error">{t.common.genericError}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
