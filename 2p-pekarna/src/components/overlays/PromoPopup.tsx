import type { Promotion } from "../../types";
import type { T } from "../../i18n";

type Props = {
  items: Promotion[];
  t: T;
};

/**
 * Promo popup — zobrazí se pouze pokud existují aktivní akce.
 * Placeholder — bude rozšířen.
 */
export function PromoPopup({ items }: Props) {
  if (items.length === 0) return null;

  // TODO: implementovat grafiku promo popupu
  return null;
}
