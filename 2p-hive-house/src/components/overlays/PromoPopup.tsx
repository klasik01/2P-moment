import { useState } from "react";
import type { Promotion } from "../../types";
import type { T } from "../../i18n";

/**
 * Popup se sezónními akcemi načítanými z Firestore.
 * Stejná mechanika jako v hive-house — lze kliknout na další, zavřít, atd.
 */
export function PromoPopup({ items, t }: { items: Promotion[]; t: T }) {
  const [dismissed, setDismissed] = useState(false);
  const [idx, setIdx] = useState(0);

  if (dismissed || items.length === 0) return null;
  const current = items[idx];

  return (
    <div className="promo-popup" role="dialog" aria-live="polite">
      <button className="promo-popup-close" onClick={() => setDismissed(true)} aria-label={t.common.close}>✕</button>
      <span className="badge badge-honey">🐝 {current.badge}</span>
      <h4>{current.title}</h4>
      <p>{current.text}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a href={current.ctaHref} className="btn btn-primary" style={{ padding: "10px 20px", fontSize: 13 }}>
          {current.ctaLabel}
        </a>
        {items.length > 1 && (
          <button
            type="button"
            className="btn btn-outline-honey"
            style={{ padding: "10px 16px", fontSize: 13 }}
            onClick={() => setIdx((i) => (i + 1) % items.length)}
          >
            {t.common.next}
          </button>
        )}
      </div>
    </div>
  );
}
