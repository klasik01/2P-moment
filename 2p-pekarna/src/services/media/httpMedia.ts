// ============================================================
// HTTP implementace MediaService — až budou fotky na 2p-api.
//
// Zatím se nepoužívá; fasáda ji zapne, jakmile bude endpoint
// hotový. Volající kód se měnit nebude, proto tady sedí předem.
//
// Očekávaný tvar odpovědi GET /pekarna/media:
//   { images: [{ id, url, alt, width, height }],
//     albums: { "unit-1": ["living-bay", ...] } }
// ============================================================

import type { AlbumId, MediaId, MediaImage, MediaService } from "./contracts";

type CatalogResponse = {
  images: MediaImage[];
  albums: Record<AlbumId, MediaId[]>;
};

const TIMEOUT_MS = 10_000;

export function createHttpMedia(baseUrl: string): MediaService {
  const base = baseUrl.replace(/\/+$/, "");
  const images = new Map<MediaId, MediaImage>();
  let albums: Record<AlbumId, MediaId[]> = {};

  return {
    async loadCatalog() {
      const response = await fetch(`${base}/pekarna/media`, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`Katalog fotek se nepodařilo načíst (${response.status})`);
      }

      const data = (await response.json()) as CatalogResponse;
      images.clear();
      for (const image of data.images) images.set(image.id, image);
      albums = data.albums ?? {};
    },

    getImage(id: MediaId) {
      return images.get(id);
    },

    getAlbum(id: AlbumId) {
      return (albums[id] ?? [])
        .map((imageId) => images.get(imageId))
        .filter((img): img is MediaImage => Boolean(img));
    },
  };
}
