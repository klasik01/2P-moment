import { useEffect } from "react";
import type { SeoMeta } from "../../types";

type Props = { meta: SeoMeta };

export function SEOHead({ meta }: Props) {
  useEffect(() => {
    document.title = meta.title;

    const setMeta = (name: string, content: string | undefined) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", meta.description);
    setMeta("keywords", meta.keywords);
  }, [meta]);

  return null;
}
