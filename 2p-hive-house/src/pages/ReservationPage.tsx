import type { HomepageData, SeoMeta } from "../types";
import { SEOHead } from "../components/ui/SEOHead";
import { ReservationSection } from "../components/sections/ReservationSection";
import { cs } from "../i18n";

type Props = {
  data: HomepageData;
};

/**
 * Samostatná stránka REZERVACE.
 * Má vlastní SEO (title/description/OG) a obsahuje pouze jeden hlavní blok
 * ReservationSection — hero s obrázkem + embed rezervačního widgetu.
 */
export function ReservationPage({ data }: Props) {
  const seo: SeoMeta = {
    title: cs.reservation.seoTitle,
    description: cs.reservation.seoDescription,
    keywords: cs.reservation.seoKeywords,
    ogImage: data.seo.ogImage,
    canonical: "https://hivehouse.2pmoment.cz/rezervace",
    breadcrumbs: [
      { name: "Hive House", url: "https://hivehouse.2pmoment.cz/" },
      { name: "Rezervace" },
    ],
  };

  return (
    <>
      <SEOHead meta={seo} />
      <ReservationSection data={data.reservation} />
    </>
  );
}
