import type { T } from "../i18n";
import type { HomepageData } from "../types";
import { HeroSection } from "../components/layout/HeroSection";

type Props = {
  t: T;
  data: HomepageData;
  onConstructionClick: () => void;
};

export function HomePage({ data, onConstructionClick: _onConstructionClick }: Props) {
  return (
    <>
      <HeroSection data={data.hero} />
      {/* Další sekce budou přidány postupně */}
    </>
  );
}
