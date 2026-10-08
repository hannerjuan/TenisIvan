/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "wompi" turns on real payments; anything else keeps the checkout in demo mode */
  readonly VITE_PAYMENTS_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
