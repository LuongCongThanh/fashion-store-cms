import { useOverlay } from '@nuxt/ui/composables'

import ConfirmDialog from './ConfirmDialog.vue'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  color?: 'error' | 'primary'
}

/** Mở dialog xác nhận global; một dialog = một Promise<boolean> (§P). Gọi trong setup. */
export function useConfirm(): (options: ConfirmOptions) => Promise<boolean> {
  const overlay = useOverlay()
  const dialog = overlay.create(ConfirmDialog)
  return async (options) => {
    const result: unknown = await dialog.open(options).result
    return result === true
  }
}
