import type { HomepageData } from "../types";
import { HeroSection } from "../components/layout/HeroSection";
import { ContentSection } from "../components/sections";
import { SEOHead } from "../components/ui";

type Props = {
  data: HomepageData;
};

/** Úvodní stránka — pořadí sekcí podle zadání klienta. */
export function HomePage({ data }: Props) {
  return (
    <>
      <SEOHead meta={data.seo} />
      <HeroSection data={data.hero} />
      <ContentSection data={data.intro} />
      <ContentSection data={data.accommodation} muted />
      <ContentSection data={data.audience} />
      <ContentSection data={data.commercial} muted />
      <ContentSection data={data.history} />
      <ContentSection data={data.contactCta} muted />
    </>
  );
}
