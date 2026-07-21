import type { AboutPageData } from "../types";
import { ContentSection } from "../components/sections";
import { SEOHead } from "../components/ui";

type Props = {
  data: AboutPageData;
};

export function AboutPage({ data }: Props) {
  return (
    <>
      <SEOHead meta={data.seo} />
      <ContentSection data={data.intro} />
    </>
  );
}
