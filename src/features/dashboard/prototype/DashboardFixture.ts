// PROTOTYPE (Phase 0.5) — dữ liệu tĩnh, có cả giá trị biên (tên dài, số lớn), không merge.
export const kpis = {
  revenue: { value: 1_284_560_000, delta: 12.4 },
  orders: { value: 1_842, delta: -3.1 },
  customers: { value: 12_905, delta: 4.8 },
  aov: { value: 697_000, delta: 1.2 },
}

export const revenuePoints = [
  { label: 'T2', value: 142_000_000 },
  { label: 'T3', value: 168_000_000 },
  { label: 'T4', value: 151_000_000 },
  { label: 'T5', value: 189_000_000 },
  { label: 'T6', value: 236_000_000 },
  { label: 'T7', value: 274_000_000 },
  { label: 'CN', value: 124_560_000 },
]

export const queues = [
  { key: 'pending', label: 'Đơn chờ xác nhận', count: 23, tone: 'warning', to: '/orders?status=pending' },
  { key: 'processing', label: 'Đơn đang đóng gói', count: 41, tone: 'info', to: '/orders?status=processing' },
  { key: 'lowStock', label: 'SKU sắp hết hàng', count: 7, tone: 'error', to: '/inventory' },
  { key: 'refund', label: 'Yêu cầu hoàn tiền', count: 2, tone: 'neutral', to: '/orders?status=refunded' },
] as const

export const recentOrders = [
  { id: 'o-1048', number: '#FS-1048', customer: 'Nguyễn Thị Minh Khai Phương', total: 2_490_000, status: 'pending' },
  { id: 'o-1047', number: '#FS-1047', customer: 'Trần Bảo', total: 890_000, status: 'processing' },
  { id: 'o-1046', number: '#FS-1046', customer: 'Lê Hoàng Anh', total: 12_350_000, status: 'shipped' },
  { id: 'o-1045', number: '#FS-1045', customer: 'Phạm Quỳnh', total: 459_000, status: 'delivered' },
  { id: 'o-1044', number: '#FS-1044', customer: 'Võ Đức Thắng', total: 1_120_000, status: 'cancelled' },
] as const

export const topProducts = [
  { id: 'p-1', name: 'Áo blazer linen dáng suông — Ivory', sold: 312, revenue: 405_600_000 },
  { id: 'p-2', name: 'Đầm midi lụa xếp ly', sold: 241, revenue: 289_200_000 },
  { id: 'p-3', name: 'Quần ống rộng cạp cao', sold: 198, revenue: 138_600_000 },
  { id: 'p-4', name: 'Túi tote da thật Atelier', sold: 87, revenue: 130_500_000 },
]

export const lowStock = [
  { id: 's-1', name: 'Áo blazer linen — Ivory / S', stock: 2 },
  { id: 's-2', name: 'Đầm midi lụa xếp ly — Đen / M', stock: 3 },
  { id: 's-3', name: 'Sơ mi oversize cotton Nhật — Trắng / XL', stock: 0 },
]

export const statusTone = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'primary',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'neutral',
} as const

export const statusLabel: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
  refunded: 'Đã hoàn tiền',
}

export const vnd = (value: number) => `${value.toLocaleString('vi-VN')} ₫`
export const compactVnd = (value: number) =>
  `${new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(value)} ₫`
