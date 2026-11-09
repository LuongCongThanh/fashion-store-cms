// PROTOTYPE (Phase 0.5) — 1 đơn hàng tĩnh có tên/địa chỉ dài, nhiều dòng, giảm giá. Không merge.
import type { Order } from '@features/orders/types/Order.types'

export const order: Order = {
  id: 'o-1048',
  number: '#FS-1048',
  status: 'processing',
  paymentStatus: 'paid',
  subtotal: 6_830_000,
  discount: 683_000,
  shippingCost: 35_000,
  total: 6_182_000,
  createdAt: '09/11/2026 08:42',
  customer: { id: 'c-77', name: 'Nguyễn Thị Minh Khai Phương', email: 'minhkhai.phuong.nguyen@example-mail.com.vn' },
  shipping: {
    address: 'Tầng 12, Toà nhà Bitexco, 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    carrier: 'Giao Hàng Nhanh',
    trackingNumber: 'GHN-8823-5571-09',
  },
  payment: { method: 'VNPay — Thẻ Visa ••4421', reference: 'VNP-20261109-004812' },
  items: [
    {
      id: 'i-1',
      name: 'Áo blazer linen dáng suông — Ivory / S',
      sku: 'BLZ-LIN-001-IV-S',
      quantity: 1,
      price: 1_890_000,
    },
    {
      id: 'i-2',
      name: 'Đầm midi lụa xếp ly cổ yếm phối nơ lưng — Đen / M',
      sku: 'DRS-SLK-014-BK-M',
      quantity: 2,
      price: 1_960_000,
    },
    { id: 'i-3', name: 'Sơ mi oversize cotton Nhật — Trắng / L', sku: 'SHT-OVS-021-WH-L', quantity: 1, price: 650_000 },
    { id: 'i-4', name: 'Tất cổ cao (set 3 đôi)', sku: 'ACC-SCK-003', quantity: 2, price: 185_000 },
  ],
  timeline: [
    { id: 't-4', label: 'Bắt đầu đóng gói — Kho Thủ Đức', createdAt: '09/11 10:15' },
    { id: 't-3', label: 'Đã xác nhận bởi Mock Admin', createdAt: '09/11 09:02' },
    { id: 't-2', label: 'Thanh toán thành công qua VNPay', createdAt: '09/11 08:43' },
    { id: 't-1', label: 'Khách đặt hàng trên website', createdAt: '09/11 08:42' },
  ],
}

export const lifecycle = [
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'shipped', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
] as const

export const vnd = (value: number) => `${value.toLocaleString('vi-VN')} ₫`
