import type { App } from 'vue'
import type { Router } from 'vue-router'

// Glue Vue cho lỗi không bắt (§O.4). Quyết định "có hiển thị không" nằm ở ErrorPolicy/Notifier.
import { isSilent } from '@shared/lib/api/errors/ErrorPolicy'

import type { Notifier } from '@shared/composables/UseNotify'

export interface ErrorHandlingDeps {
  router: Router
  notifier: Notifier
  /** Tải lại trang — chỉ test thay. */
  reload?: () => void
}

const CHUNK_RELOAD_FLAG = 'cms.chunkReloaded'

function isChunkLoadError(err: unknown) {
  return (
    err instanceof Error &&
    /dynamically imported module|Importing a module script failed|Loading chunk/i.test(err.message)
  )
}

/** Gắn errorHandler, unhandledrejection, router.onError. Trả hàm gỡ listener của window. */
export function installErrorHandling(app: App, deps: ErrorHandlingDeps): () => void {
  const report = (err: unknown) => {
    if (isSilent(err)) return
    console.error(err)
    deps.notifier.error(err)
  }

  app.config.errorHandler = report

  // Deploy mới xoá chunk cũ → tải lại trang MỘT lần (cờ trong sessionStorage chặn vòng lặp reload).
  deps.router.onError((err) => {
    if (!isChunkLoadError(err) || sessionStorage.getItem(CHUNK_RELOAD_FLAG)) return report(err)
    sessionStorage.setItem(CHUNK_RELOAD_FLAG, '1')
    ;(deps.reload ?? (() => window.location.reload()))()
  })

  const onRejection = (event: PromiseRejectionEvent) => report(event.reason)
  window.addEventListener('unhandledrejection', onRejection)
  return () => window.removeEventListener('unhandledrejection', onRejection)
}
