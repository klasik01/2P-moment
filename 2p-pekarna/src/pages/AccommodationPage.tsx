import type { AccommodationPageData } from "../types";
import { ContentSection, UnitsSection, GallerySection } from "../components/sections";
import { SEOHead } from "../components/ui";

type Props = {
  data: AccommodationPageData;
};

export function AccommodationPage({ data }: Props) {
  return (
    <>
      <SEOHead meta={data.seo} />
      <ContentSection data={data.intro} />
      <UnitsSection data={data.units} id="byty" />
      <GallerySection data={data.gallery} />
      <ContentSection data={data.reservationCta} muted />
    </>
  );
}
