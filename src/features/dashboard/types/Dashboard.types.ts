import type { ValueFormat } from '@shared/lib/format/Format'

export interface DashboardItem {
  id: string
  label: string
  value: number
}
export interface DashboardPayload {
  value?: number
  points?: { label: string; value: number }[]
  items?: DashboardItem[]
}
export interface DashboardWidget {
  key: string
  title: string
  kind: 'stat' | 'chart' | 'list' | 'queue'
  to?: string
  permission: string
  /** Cách hiển thị giá trị của stat/list; mặc định là số đếm. */
  format?: ValueFormat
  /** Widget list: mỗi item dẫn tới đâu. */
  link?: (item: DashboardItem) => string
}
