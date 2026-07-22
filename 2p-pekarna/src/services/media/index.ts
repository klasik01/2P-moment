// ============================================================
// Fasáda media service.
//
//   import { media } from "../services/media";
//   const img = media.getImage("exterior-corner");
//   const album = media.getAlbum("unit-1");
//
// Dnes čte z lokální složky. Až bude endpoint na 2p-api hotový,
// změní se jediný řádek níž — volající kód zůstane stejný.
// ============================================================

import type { AlbumId, MediaId, MediaImage, MediaService } from "./contracts";
import { createLocalMedia } from "./localMedia";

// Až bude /pekarna/media na API hotové:
//   const apiUrl = import.meta.env.VITE_API_URL?.trim();
//   let _media = apiUrl ? createHttpMedia(apiUrl) : createLocalMedia();
let _media: MediaService = createLocalMedia();

/** Přepne implementaci — pro testy nebo pozdější přechod na API. */
export function setMedia(impl: MediaService) {
  _media = impl;
}

export const media: MediaService = {
  loadCatalog: () => _media.loadCatalog(),
  getImage: (id) => _media.getImage(id),
  getAlbum: (id) => _media.getAlbum(id),
};

export type { AlbumId, MediaId, MediaImage, MediaService };
