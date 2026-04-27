import { useEffect, useState } from "react";
import { t } from "../i18n";
import type { Promotion } from "../types/content";
import { Icon } from "./Icon";

export function PromoPopup({ items }: { items: Promotion[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePromotion, setActivePromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const firstPromotion = items[0];
    const dismissed = window.localStorage.getItem(`promo-dismissed:${firstPromotion.id}`);

    if (!dismissed) {
      setActivePromotion(firstPromotion);
      const timer = window.setTimeout(() => setIsOpen(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, [items]);

  if (!activePromotion) return null;

  return (
    <div className={`promo-popup ${isOpen ? "open" : ""}`} aria-live="polite">
      <button
        type="button"
        className="promo-close"
        aria-label={t("promo.close")}
        onClick={() => {
          window.localStorage.setItem(`promo-dismissed:${activePromotion.id}`, "true");
          setIsOpen(false);
        }}
      >
        <Icon name="close" size={18} />
      </button>
      <span className="promo-badge">{activePromotion.badge}</span>
      <h3>{activePromotion.title}</h3>
      <p>{activePromotion.text}</p>
      <a href={activePromotion.ctaHref} className="btn btn-primary" onClick={() => setIsOpen(false)}>
        {activePromotion.ctaLabel}
        <Icon name="arrow-right" size={16} />
      </a>
    </div>
  );
}
