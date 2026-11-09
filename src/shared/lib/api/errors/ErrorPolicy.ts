// Nơi DUY NHẤT trả lời "lỗi này xử lý thế nào" (§O.4, D39). Các module khác chỉ là adapter mỏng.
import { isCancel } from 'axios'

import { isApiError } from './ApiError'
import { codeFromStatus, ErrorCode } from './ErrorCode'

/** Query/mutation có retry không: chỉ NETWORK_ERROR, TIMEOUT, 5xx. */
export function isRetryable(e: unknown): boolean {
  if (!isApiError(e)) return false
  return e.code === ErrorCode.NETWORK_ERROR || e.code === ErrorCode.TIMEOUT || e.status >= 500
}

/** Key i18n: errors.<code> → errors.<codeFromStatus(status)> → errors.UNKNOWN. `has` kiểm tra key tồn tại. */
export function messageKeyOf(e: unknown, has: (key: string) => boolean): string {
  if (isApiError(e)) {
    for (const code of [e.code, codeFromStatus(e.status)]) {
      if (has(`errors.${code}`)) return `errors.${code}`
    }
  }
  return `errors.${ErrorCode.UNKNOWN}`
}

/** Lỗi không hiển thị gì: request bị huỷ. */
export function isSilent(e: unknown): boolean {
  return isCancel(e)
}

export type MutationErrorRoute = 'form' | 'local' | 'silent' | 'toast'

/** Mutation lỗi đi đâu (§O.4). */
export function routeMutationError(e: unknown, meta?: { errorHandling?: 'global' | 'local' }): MutationErrorRoute {
  if (isSilent(e)) return 'silent'
  if (meta?.errorHandling === 'local') return 'local'
  if (isApiError(e) && (e.status === 400 || e.status === 422) && hasFields(e.fields)) return 'form'
  return 'toast'
}

function hasFields(fields?: Record<string, string[]>) {
  return !!fields && Object.keys(fields).length > 0
}
