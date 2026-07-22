import type { HomepageData } from "../types";
import type { T } from "../i18n";
import { HeroSection } from "../components/layout/HeroSection";
import { ContentSection } from "../components/sections";
import { SEOHead } from "../components/ui";

type Props = {
  t: T;
  data: HomepageData;
};

/** Úvodní stránka — pořadí sekcí podle zadání klienta. */
export function HomePage({ t, data }: Props) {
  return (
    <>
      <SEOHead meta={data.seo} />
      <HeroSection data={data.hero} t={t} scrollTo={`#${data.intro.anchor ?? "o-objektu"}`} />
      <ContentSection data={data.intro} />
      <ContentSection data={data.accommodation} muted />
      <ContentSection data={data.audience} />
      <ContentSection data={data.commercial} muted />
      <ContentSection data={data.history} />
      <ContentSection data={data.contactCta} muted />
    </>
  );
}
