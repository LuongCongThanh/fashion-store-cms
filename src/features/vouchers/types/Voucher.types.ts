/** Loại giảm: theo % (1–100, có thể có Mức giảm tối đa) hoặc số tiền cố định (VND). */
export type VoucherType = 'PERCENT' | 'FIXED'

/** Trạng thái tính tại thời điểm API trả về. */
export type VoucherStatus = 'ACTIVE' | 'UPCOMING' | 'ENDED' | 'EXHAUSTED' | 'DISABLED'

export interface Voucher {
  id: string
  /** In hoa, không đổi sau khi tạo. */
  code: string
  type: VoucherType
  value: number
  /** Chỉ với PERCENT; null = không giới hạn. */
  maxDiscount: number | null
  /** Tạm tính tối thiểu (VND), 0 = không điều kiện. */
  minSubtotal: number
  /** null = không giới hạn. */
  totalLimit: number | null
  /** Số lần mỗi Người mua được dùng; null = không giới hạn. */
  perBuyerLimit: number | null
  usedCount: number
  startsAt: string
  /** Mốc kết thúc (không bao gồm). */
  endsAt: string
  isActive: boolean
  status: VoucherStatus
}
