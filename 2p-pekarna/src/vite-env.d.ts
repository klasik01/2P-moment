/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL na 2p-api. Prázdné → mock režim, poptávky se neodesílají. */
  readonly VITE_API_URL: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
