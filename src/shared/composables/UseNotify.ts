import { inject } from 'vue'

import type { InjectionKey } from 'vue'

import { isSilent, messageKeyOf } from '@shared/lib/api/errors/ErrorPolicy'

import type { MessageKey } from '@shared/lib/i18n/I18n'

/** Hiển thị toast; key lỗi lấy từ ErrorPolicy.messageKeyOf (§O.4). */
export interface Notifier {
  success(key: MessageKey): void
  error(e: unknown): void
  /** Toast không tự tắt, có một nút hành động (VD "Đã có phiên bản mới" + Tải lại). */
  prompt(key: MessageKey, action: { label: MessageKey; onClick: () => void }): void
}

interface ToastInput {
  color: 'error' | 'info' | 'success'
  title: string
  duration?: number
  actions?: { label: string; onClick: () => void }[]
}

export interface NotifierDeps {
  /** Đích hiển thị — `useToast()` của Nuxt UI ở prod, fake trong test. */
  toast: { add(toast: ToastInput): unknown }
  /** Dịch key i18n. */
  t: (key: string) => string
  /** Key i18n có tồn tại không. */
  te: (key: string) => boolean
}

export function createNotifier(deps: NotifierDeps): Notifier {
  return {
    success(key) {
      deps.toast.add({ color: 'success', title: deps.t(key) })
    },
    prompt(key, action) {
      deps.toast.add({
        color: 'info',
        title: deps.t(key),
        duration: 0,
        actions: [{ label: deps.t(action.label), onClick: action.onClick }],
      })
    },
    error(e) {
      if (isSilent(e)) return
      deps.toast.add({ color: 'error', title: deps.t(messageKeyOf(e, deps.te)) })
    },
  }
}

export const NOTIFIER_KEY: InjectionKey<Notifier> = Symbol('Notifier')

/** Notifier dùng chung của app (provide bởi createAppRuntime). */
export function useNotify(): Notifier {
  const notifier = inject(NOTIFIER_KEY)
  if (!notifier) throw new Error('useNotify() cần createAppRuntime().plugin đã được cài.')
  return notifier
}
