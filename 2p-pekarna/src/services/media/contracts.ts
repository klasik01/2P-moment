// ============================================================
// Media service — přístup k fotkám.
//
// Rozhraní je navržené tak, jako by fotky už teď chodily z API:
// katalog se jednou načte (`loadCatalog`), pak se z něj čte
// synchronně podle ID. Až se fotky přesunou na 2p-api, vymění se
// jen implementace — volající kód zůstane beze změny.
//
// Komponenty NIKDY nesestavují cestu k souboru ručně.
// ============================================================

/** Stabilní identifikátor fotky, nezávislý na názvu souboru. */
export type MediaId = string;

/** Identifikátor sady fotek (galerie, detail bytu). */
export type AlbumId = string;

export type MediaImage = {
  id: MediaId;
  /** Připravená URL k použití v `src`. */
  url: string;
  /** Popis pro odečítač. Až přijde API, dodá ho spolu s fotkou. */
  alt: string;
  width?: number;
  height?: number;
};

export interface MediaService {
  /**
   * Načte katalog. Volá se jednou při startu aplikace.
   * Lokální implementace vrátí hotovo okamžitě, HTTP sáhne na API.
   */
  loadCatalog(): Promise<void>;

  /** Fotka podle ID. `undefined`, když v katalogu není. */
  getImage(id: MediaId): MediaImage | undefined;

  /** Sada fotek podle ID alba. Prázdné pole, když album neexistuje. */
  getAlbum(id: AlbumId): MediaImage[];
}
