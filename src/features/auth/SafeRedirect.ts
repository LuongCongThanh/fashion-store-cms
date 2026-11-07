const HOME = '/admin'

/**
 * Chọn đích sau khi đăng nhập từ `?redirect=`. Chỉ nhận path nội bộ dưới `/admin`
 * (chặn open redirect `//evil.com`, `https://…`); còn lại về `/admin`.
 */
export function safeRedirect(raw: unknown): string {
  if (typeof raw !== 'string') return HOME
  return /^\/admin(?:[/?#]|$)/.test(raw) && !raw.includes('\\') ? raw : HOME
}
