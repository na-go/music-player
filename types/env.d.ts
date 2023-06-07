/// <reference types="vite/client" />

interface ImportMetaEnv {
  //
}

interface ImportMeta {
  readonly env: Readonly<ImportMetaEnv>;
}
