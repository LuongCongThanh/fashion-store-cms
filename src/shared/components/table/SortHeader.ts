import UIcon from '@nuxt/ui/components/Icon.vue'
import { h } from 'vue'

type SortableColumn = { toggleSorting: () => void; getIsSorted?: () => false | 'asc' | 'desc' }

const SORT_ICONS = { asc: 'i-lucide-arrow-up', desc: 'i-lucide-arrow-down', none: 'i-lucide-arrow-up-down' } as const

/**
 * Nút sắp xếp ở header cột (DESIGN.md mục Bảng): có focus ring, icon thể hiện chiều sắp xếp
 * (mờ khi chưa sắp xếp); `align: 'right'` cho cột số/tiền.
 */
export function sortHeader(column: SortableColumn, label: string, options: { align?: 'right' } = {}) {
  const sorted = column.getIsSorted?.() || false
  return h(
    'button',
    {
      type: 'button',
      'data-sorted': sorted || undefined,
      class: [
        'group -mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 uppercase transition-colors duration-150 motion-reduce:transition-none hover:bg-accented/50 hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        sorted ? 'text-highlighted' : '',
        options.align === 'right' ? 'ml-auto flex-row-reverse' : '',
      ],
      onClick: () => {
        column.toggleSorting()
      },
    },
    [
      label,
      h(UIcon, {
        name: SORT_ICONS[sorted || 'none'],
        'aria-hidden': 'true',
        class: [
          'size-3.5 shrink-0',
          sorted ? 'text-primary' : 'opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60',
        ],
      }),
    ],
  )
}
