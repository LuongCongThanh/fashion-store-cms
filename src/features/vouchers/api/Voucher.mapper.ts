import type { Voucher } from '@features/vouchers/types/Voucher.types'
import type { components } from '@shared/lib/api/Api.generated'

export type VoucherResponseDto = components['schemas']['VoucherResponseDto']
export type PaginatedVoucherResponseDto = components['schemas']['PaginatedVoucherResponseDto']

export function toVoucher(dto: VoucherResponseDto): Voucher {
  return {
    id: dto.id,
    code: dto.code,
    type: dto.type,
    value: dto.value,
    maxDiscount: dto.maxDiscount,
    minSubtotal: dto.minSubtotal,
    totalLimit: dto.totalLimit,
    perBuyerLimit: dto.perBuyerLimit,
    usedCount: dto.usedCount,
    startsAt: dto.startsAt,
    endsAt: dto.endsAt,
    isActive: dto.isActive,
    status: dto.status,
  }
}
