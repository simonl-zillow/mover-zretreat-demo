/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `mock` (default) = local JSON only. `live` = POST to /api/propertysearch via Vite proxy. */
  readonly VITE_DATA_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
