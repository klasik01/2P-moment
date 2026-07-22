// ============================================================
// Katalog fotek — dočasná náhrada API.
//
// Soubory leží v `public/images/`. Popisy odpovídají tomu, co je
// na snímcích doopravdy (ověřeno pohledem, ne odhadem).
//
// Až fotky poputují přes 2p-api, tenhle soubor zmizí a stejná data
// přijdou z endpointu — proto se na ID odkazuje i v datech stránek.
//
// POZOR: současné fotky jsou fotoreport nemovitosti, ne marketingové
// snímky ubytování. Obsahují kotelnu, rozestavěnou koupelnu a půdu
// se stavebním materiálem. Doporučeno přefotit.
// ============================================================

import type { AlbumId, MediaId } from "./contracts";

export type CatalogEntry = {
  file: string;
  alt: string;
};

const f = (n: number) => `/images/RD, Pacov (${n}).jpg`;

export const CATALOG: Record<MediaId, CatalogEntry> = {
  // --- Exteriér ---
  "exterior-front":     { file: f(1),  alt: "Bývalá pekárna — čelní pohled z ulice" },
  "exterior-corner":    { file: f(2),  alt: "Budova bývalé pekárny v Pacově, pohled z nároží" },
  "exterior-side":      { file: f(21), alt: "Bývalá pekárna — pohled z ulice" },
  "courtyard-chimney":  { file: f(18), alt: "Dvorní část objektu s původním komínem" },
  "courtyard-garden":   { file: f(19), alt: "Dvorní část objektu se zahradou" },
  "view-roof":          { file: f(12), alt: "Výhled z objektu přes střechy" },

  // --- Obytné prostory ---
  "living-bay":         { file: f(11), alt: "Obytný pokoj s arkýřovým oknem" },
  "living-carpet":      { file: f(10), alt: "Obytný pokoj" },
  "living-antique":     { file: f(7),  alt: "Obytný pokoj" },
  "bedroom":            { file: f(15), alt: "Ložnice" },
  "kitchen-white":      { file: f(8),  alt: "Kuchyně s jídelním koutem" },
  "kitchen-wood":       { file: f(17), alt: "Kuchyňská linka" },
  "veranda":            { file: f(9),  alt: "Prosklená veranda" },
  "bathroom":           { file: f(16), alt: "Koupelna" },
  "hallway":            { file: f(6),  alt: "Chodba" },
  "staircase":          { file: f(4),  alt: "Schodiště v objektu" },

  // --- Provozní a technické prostory ---
  "storage-shelves":    { file: f(5),  alt: "Skladovací prostor s regály" },
  "boiler-room":        { file: f(3),  alt: "Technická místnost s kotlem" },
  "attic-beams":        { file: f(13), alt: "Půdní prostor s dřevěným krovem" },
  "attic-chimney":      { file: f(14), alt: "Půdní prostor s komínem" },
};

/** Sady fotek pro galerie a detaily. */
export const ALBUMS: Record<AlbumId, MediaId[]> = {
  accommodation: [
    "living-bay", "living-carpet", "living-antique", "kitchen-white",
    "kitchen-wood", "bedroom", "veranda", "bathroom",
    "hallway", "staircase", "view-roof", "exterior-corner",
  ],

  commercial: [
    "storage-shelves", "boiler-room", "attic-beams",
    "attic-chimney", "courtyard-chimney", "courtyard-garden",
  ],

  // Detaily bytů. Rozdělení je zatím orientační — zadání neuvádí,
  // který byt je který, takže se po upřesnění od klienta přeskládá.
  "unit-1": ["living-bay", "kitchen-white", "bathroom", "hallway"],
  "unit-2": ["living-carpet", "kitchen-wood", "veranda", "staircase"],
  "unit-3": ["bedroom", "living-antique", "view-roof", "hallway"],
};
