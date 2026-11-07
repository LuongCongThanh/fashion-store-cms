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
} as const
