/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLATFORM: 'web' | 'tauri';
  readonly VITE_SAFE_MODE: 'true';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
