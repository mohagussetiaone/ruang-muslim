/// <reference types="vite/client" />

// Deklarasi tipe untuk file .vue
// Tanpa ini TypeScript tidak tahu apa itu import *.vue
declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Tipe untuk import.meta.env (Vite env variables)
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PRAYER_API_URL: string;
  // tambah env lain di sini
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
