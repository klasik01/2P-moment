import { useState } from "react";
import type { T } from "../../i18n";
import { useModalOpen } from "../../hooks/useModalOpen";
import { constructionConfig } from "../../config/profiles";
import { asset } from "../../utils/asset";
import { backend } from "../../services";

type Props = {
  t: T;
  onClose: () => void;
};

/**
 * Modal "Ve výstavbě" — zobrazí se při vstupu na web, když je aktivní
 * profil VE_VYSTAVBE. Obsahuje e-mail subscription formulář.
 */
export function ConstructionModal({ t, onClose }: Props) {
  useModalOpen(true, onClose);

  const cfg = constructionConfig;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;

    setStatus("sending");
    try {
      const docId = await backend.createSubscription({
        email: email.trim(),
        source: "construction_popup",
      });
      console.log("[ConstructionModal] Success, docId:", docId);
      setStatus("success");
    } catch (err) {
      console.error("[ConstructionModal] Error:", err);
      setStatus("error");
    }
  };

  return (
    <div
      className="modal-backdrop construction-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="construction-title"
      onClick={onClose}
    >
      <div className="modal construction-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t.common.close}>
          ✕
        </button>

        <div className="construction-modal-logo" aria-hidden="true">
          <img src={asset("/logo.png")} alt="Hive House" className="construction-modal-logo-img" />
        </div>

        <h2 id="construction-title" className="modal-title">
          {cfg.popupTitle}
        </h2>

        <p className="modal-desc">{cfg.popupText}</p>

        <div className="construction-modal-date">
          <span className="construction-modal-date-label">{cfg.badge}</span>
          <span className="construction-modal-date-value">{cfg.expectedDate}</span>
        </div>

        {status === "success" ? (
          <div className="construction-modal-success">
            <span aria-hidden="true">✓</span>
            {cfg.popupSuccessMessage}
          </div>
        ) : (
          <form className="construction-modal-form" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder={cfg.popupEmailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="construction-modal-input"
              disabled={status === "sending"}
            />
            <button
              type="submit"
              className="btn btn-primary construction-modal-btn"
              disabled={status === "sending"}
            >
              {status === "sending" ? t.common.sending : cfg.popupCtaLabel}
            </button>
            {status === "error" && (
              <p className="construction-modal-error">
                {t.common.genericError}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
