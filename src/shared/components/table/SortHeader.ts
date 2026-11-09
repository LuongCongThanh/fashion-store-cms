import { h } from 'vue'

/** Nút sắp xếp ở header cột (DESIGN.md mục Bảng): có focus ring; `align: 'right'` cho cột số/tiền. */
export function sortHeader(column: { toggleSorting: () => void }, label: string, options: { align?: 'right' } = {}) {
  return h(
    'button',
    {
      type: 'button',
      class: [
        'inline-flex items-center rounded-sm hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        options.align === 'right' ? 'ml-auto w-full justify-end' : '',
      ],
      onClick: () => {
        column.toggleSorting()
      },
    },
    label,
  )
}
