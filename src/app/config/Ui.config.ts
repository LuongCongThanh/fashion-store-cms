/** Nguồn DUY NHẤT map màu ngữ nghĩa + mặc định component (D26, §L.2, §L.11). vite.config.ts import. */
export const uiConfig = {
  colors: {
    primary: 'brand',
    secondary: 'indigo',
    success: 'emerald',
    info: 'sky',
    warning: 'amber',
    error: 'red',
    neutral: 'slate',
  },
  button: { defaultVariants: { size: 'md' } },
  input: { defaultVariants: { size: 'md' } },
  table: { slots: { th: 'text-sm', td: 'text-sm tabular-nums' } },
  badge: { defaultVariants: { variant: 'subtle' } },
  // Chữ lỗi của UFormField: bước đậm thay cho `text-error` (500, ≈3.8:1), xem DESIGN.md "Tương phản của màu trạng thái".
  formField: { slots: { error: 'mt-2 text-red-700 dark:text-red-400' } },
} as const
