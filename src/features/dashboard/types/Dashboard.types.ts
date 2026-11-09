export interface DashboardPayload {
  value?: number
  points?: { label: string; value: number }[]
  items?: { id: string; label: string; value: number }[]
}
export interface DashboardWidget {
  key: string
  title: string
  kind: 'stat' | 'chart' | 'list'
  permission: string
}
