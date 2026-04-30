import type { T } from "../i18n";
import type { HomepageData } from "../types";
import { HeroSection } from "../components/layout/HeroSection";
import {
  AboutSection,
  ApartmentsSection,
  GallerySection,
  NearbySection,
  InquiryFormSection,
} from "../components/sections";

type Props = {
  t: T;
  data: HomepageData;
};

export function HomePage({ t, data }: Props) {
  return (
    <>
      <HeroSection data={data.hero} />
      <AboutSection data={data.about} />
      <ApartmentsSection data={data.apartments} />
      <GallerySection data={data.gallery} />
      <NearbySection data={data.nearby} />
      <InquiryFormSection data={data.inquiry} t={t} />
    </>
  );
}
