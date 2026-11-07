/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** 'true' → Mock auth khi chạy DEV (bỏ qua ở production). */
  readonly VITE_MOCK_AUTH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
