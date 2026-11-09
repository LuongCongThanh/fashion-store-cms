// PROTOTYPE (Phase 0.5) — dữ liệu tĩnh có tên dài, giá lớn, thiếu ảnh, hết hàng.
export interface ProtoProduct {
  id: string
  name: string
  sku: string
  category: string
  status: 'draft' | 'published' | 'archived'
  price: number
  salePrice?: number
  stock: number
  variants: number
  updatedAt: string
  swatch?: string
}

export const products: ProtoProduct[] = [
  {
    id: 'p-1',
    name: 'Áo blazer linen dáng suông',
    sku: 'BLZ-LIN-001',
    category: 'Áo khoác',
    status: 'published',
    price: 1_890_000,
    stock: 42,
    variants: 8,
    updatedAt: '09/11',
    swatch: '#e7dccb',
  },
  {
    id: 'p-2',
    name: 'Đầm midi lụa xếp ly cổ yếm phối nơ lưng — phiên bản giới hạn Thu Đông 2026',
    sku: 'DRS-SLK-014',
    category: 'Đầm',
    status: 'published',
    price: 2_450_000,
    salePrice: 1_960_000,
    stock: 3,
    variants: 6,
    updatedAt: '08/11',
    swatch: '#1f1f22',
  },
  {
    id: 'p-3',
    name: 'Quần ống rộng cạp cao',
    sku: 'PNT-WDE-007',
    category: 'Quần',
    status: 'draft',
    price: 790_000,
    stock: 0,
    variants: 10,
    updatedAt: '08/11',
  },
  {
    id: 'p-4',
    name: 'Túi tote da thật Atelier',
    sku: 'BAG-TOT-002',
    category: 'Phụ kiện',
    status: 'published',
    price: 15_500_000,
    stock: 12,
    variants: 2,
    updatedAt: '07/11',
    swatch: '#7a4b2a',
  },
  {
    id: 'p-5',
    name: 'Sơ mi oversize cotton Nhật',
    sku: 'SHT-OVS-021',
    category: 'Áo',
    status: 'published',
    price: 650_000,
    stock: 128,
    variants: 12,
    updatedAt: '06/11',
    swatch: '#f5f5f4',
  },
  {
    id: 'p-6',
    name: 'Chân váy bút chì tweed',
    sku: 'SKT-TWD-004',
    category: 'Chân váy',
    status: 'archived',
    price: 1_150_000,
    stock: 0,
    variants: 4,
    updatedAt: '01/10',
    swatch: '#c9b8a6',
  },
  {
    id: 'p-7',
    name: 'Áo len cashmere cổ lọ',
    sku: 'KNT-CSH-009',
    category: 'Áo',
    status: 'published',
    price: 3_200_000,
    stock: 18,
    variants: 9,
    updatedAt: '05/11',
    swatch: '#9f1239',
  },
  {
    id: 'p-8',
    name: 'Giày loafer da lộn',
    sku: 'SHO-LOF-003',
    category: 'Giày',
    status: 'draft',
    price: 2_100_000,
    stock: 6,
    variants: 7,
    updatedAt: '04/11',
  },
]

export const categories = ['Áo', 'Áo khoác', 'Đầm', 'Quần', 'Chân váy', 'Giày', 'Phụ kiện']

export const statusMeta = {
  published: { label: 'Đang bán', color: 'success' },
  draft: { label: 'Nháp', color: 'neutral' },
  archived: { label: 'Lưu trữ', color: 'warning' },
} as const

export const vnd = (value: number) => `${value.toLocaleString('vi-VN')} ₫`
export const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
