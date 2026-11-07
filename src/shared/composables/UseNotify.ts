import { inject } from 'vue'

import type { InjectionKey } from 'vue'

import { isSilent, messageKeyOf } from '@shared/lib/api/errors/ErrorPolicy'

/** Hiển thị toast; key lỗi lấy từ ErrorPolicy.messageKeyOf (§O.4). */
export interface Notifier {
  success(key: string): void
  error(e: unknown): void
}

export interface NotifierDeps {
  /** Đích hiển thị — `useToast()` của Nuxt UI ở prod, fake trong test. */
  toast: { add(toast: { color: 'error' | 'success'; title: string }): unknown }
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
