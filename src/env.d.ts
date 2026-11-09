/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** 'true' → Mock auth khi chạy DEV (bỏ qua ở production). */
  readonly VITE_MOCK_AUTH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Cho typescript-eslint (projectService không hiểu .vue). vue-tsc vẫn resolve file .vue thật trước.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}
