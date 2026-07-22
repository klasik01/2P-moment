// ============================================================
// Lokální implementace MediaService — čte ze složky public/images
// přes katalog v catalog.ts.
// ============================================================

import { asset } from "../../utils/asset";
import { ALBUMS, CATALOG } from "./catalog";
import type { AlbumId, MediaId, MediaImage, MediaService } from "./contracts";

/** Mezery v názvech souborů musí do URL projít zakódované. */
function toUrl(file: string): string {
  return asset(file.replace(/ /g, "%20"));
}

export function createLocalMedia(): MediaService {
  const images = new Map<MediaId, MediaImage>();

  return {
    async loadCatalog() {
      for (const [id, entry] of Object.entries(CATALOG)) {
        images.set(id, { id, url: toUrl(entry.file), alt: entry.alt });
      }
    },

    getImage(id: MediaId) {
      const image = images.get(id);
      if (!image && import.meta.env.DEV) {
        console.warn(`[media] Fotka "${id}" není v katalogu.`);
      }
      return image;
    },

    getAlbum(id: AlbumId) {
      const ids = ALBUMS[id];
      if (!ids) {
        if (import.meta.env.DEV) console.warn(`[media] Album "${id}" neexistuje.`);
        return [];
      }
      return ids
        .map((imageId) => images.get(imageId))
        .filter((img): img is MediaImage => Boolean(img));
    },
  };
}
