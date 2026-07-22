import type { AccommodationPageData } from "../types";
import type { Translations } from "../i18n";
import { ContentSection, UnitsSection, GallerySection } from "../components/sections";
import { SEOHead } from "../components/ui";

type Props = {
  t: Translations;
  data: AccommodationPageData;
};

export function AccommodationPage({ t, data }: Props) {
  return (
    <>
      <SEOHead meta={data.seo} />
      <ContentSection data={data.intro} />
      <UnitsSection data={data.units} t={t} id="byty" muted />
      <GallerySection data={data.gallery} t={t} />
      <ContentSection data={data.reservationCta} muted />
    </>
  );
}
