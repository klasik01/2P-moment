import { ROUTES } from "../../../config/routes";
import type { DiaryContent } from "../../../types/content";

export const diary: DiaryContent = {
  label: "Novinka ve stavebnictví",
  title: "Co je elektronický stavební deník?",
  description:
    "Jako investor máte přístup ke svému projektu 24/7. Sledujete postup stavby v reálném čase přes webové rozhraní, v jednom místě najdete fotodokumentaci, zápisy z kontrolních dnů i rozpočtové úpravy. Plná transparentnost, žádná překvapení.",
  action: { label: "Chci vědět více", href: ROUTES.contact },
};
