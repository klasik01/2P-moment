import type { CommercialPageData } from "../types";
import { ContentSection } from "../components/sections";
import { SEOHead } from "../components/ui";

type Props = {
  data: CommercialPageData;
};

export function CommercialPage({ data }: Props) {
  return (
    <>
      <SEOHead meta={data.seo} />
      <ContentSection data={data.intro} />
      <ContentSection data={data.contactCta} muted />
    </>
  );
}
