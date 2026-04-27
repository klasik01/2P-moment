import { useEffect } from "react";
import type { SeoMeta } from "../../types";
import { applySeo } from "../../utils/seo";

/**
 * Renderless komponenta — při připojení nastaví <title> a meta tagy
 * podle předaného SEO objektu. Takhle lze SEO pro každou stránku
 * definovat z datového souboru.
 */
export function SEOHead({ meta }: { meta: SeoMeta }) {
  useEffect(() => {
    applySeo(meta);
  }, [meta]);
  return null;
}
