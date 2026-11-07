const HOME = '/'
const GUEST_ONLY = /^\/(?:login|forgot-password)(?:[/?#]|$)/

/**
 * Chọn đích sau khi đăng nhập từ `?redirect=`. Chỉ nhận path nội bộ (`/…`, không `//`, không `\`)
 * và không phải trang chỉ cho khách (chặn open redirect `//evil.com`, `https://…`); còn lại về `/`.
 */
export function safeRedirect(raw: unknown): string {
  if (typeof raw !== 'string') return HOME
  const internal = raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\')
  return internal && !GUEST_ONLY.test(raw) ? raw : HOME
}
