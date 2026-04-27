import type { HomepageData } from "../types";
import type { T } from "../i18n";
import { SEOHead } from "../components/ui/SEOHead";
import { HeroSection } from "../components/layout/HeroSection";
import {
  AboutSection,
  ApitherapySection,
  HowItWorksSection,
  OfferingsSection,
  VideoSection,
  GallerySection,
  ContactPanel,
  FishingCtaBand,
} from "../components/sections";

type Props = {
  t: T;
  data: HomepageData;
  onVoucherClick: () => void;
  onFishingClick: () => void;
  onConstructionClick?: () => void;
};

/**
 * Úvodní stránka Hive House.
 * Sekce pod hero jsou znovupoužitelné — najdeš je v `components/sections.ts`
 * a můžeš je bez přeposílání props použít kdekoli jinde.
 *
 * Viditelnost se řídí z pole `visible` přímo v datech každé sekce.
 * Pokud `visible` chybí nebo je true → sekce se zobrazí.
 * Data se předávají explicitně, takže sekce můžeš použít i s jinými daty.
 */
export function HomePage({ t, data, onVoucherClick, onFishingClick, onConstructionClick }: Props) {
  return (
    <>
      <SEOHead meta={data.seo} />
      {data.hero.visible !== false && (
        <HeroSection
          t={t}
          hero={data.hero}
          onVoucherClick={onVoucherClick}
          onConstructionClick={onConstructionClick}
        />
      )}

      {data.about.visible !== false && <AboutSection data={data.about} />}
      {data.apitherapy.visible !== false && <ApitherapySection data={data.apitherapy} />}
      {data.howItWorks.visible !== false && <HowItWorksSection data={data.howItWorks} />}
      {data.offerings.visible !== false && <OfferingsSection data={data.offerings} />}
      {data.videoSection.visible !== false && <VideoSection data={data.videoSection} />}
      {data.gallery.visible !== false && <GallerySection data={data.gallery} />}
      {data.contact.visible !== false && <ContactPanel contact={data.contact} />}
      {data.fishingCta.visible !== false && <FishingCtaBand data={data.fishingCta} onClick={onFishingClick} />}
    </>
  );
}
