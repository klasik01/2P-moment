import type { CommercialPageData } from "../types";
import type { Translations } from "../i18n";
import { ContentSection, GallerySection } from "../components/sections";
import { SEOHead } from "../components/ui";

type Props = {
  t: Translations;
  data: CommercialPageData;
};

export function CommercialPage({ t, data }: Props) {
  return (
    <>
      <SEOHead meta={data.seo} />
      <ContentSection data={data.intro} />
      {/* Minigalerie — menší dlaždice, prostory jsou doplňková nabídka. */}
      <GallerySection
        data={data.gallery}
        t={t}
        id="galerie-prostor"
        variant="compact"
        muted
      />
      <ContentSection data={data.contactCta} />
    </>
  );
}
