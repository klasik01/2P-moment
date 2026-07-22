import type { GallerySectionData } from "../../types";
import type { Translations } from "../../i18n";
import { media } from "../../services/media";
import { Section, SectionHead } from "../ui/Section";
import { Gallery, type GalleryVariant } from "../ui/Gallery";

type Props = {
  data: GallerySectionData;
  t: Translations;
  muted?: boolean;
  variant?: GalleryVariant;
  id?: string;
};

export function GallerySection({
  data,
  t,
  muted = false,
  variant = "default",
  id = "galerie",
}: Props) {
  if (data.visible === false) return null;

  const images = media.getAlbum(data.albumId);
  if (images.length === 0) return null;

  const titleId = `${id}-title`;

  return (
    <Section id={id} muted={muted} labelledBy={titleId}>
      <SectionHead
        eyebrow={data.eyebrow}
        title={data.title}
        titleId={titleId}
        paragraphs={[t.common.galleryHint]}
      />
      <Gallery images={images} t={t} variant={variant} />
    </Section>
  );
}
