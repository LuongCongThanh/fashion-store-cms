import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useDeleteVoucherMutation, useSaveVoucherMutation, useVoucherQuery } from '@features/vouchers/api/Vouchers.api'
import { voucherSchema } from '@features/vouchers/schemas/Voucher.schema'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { isoToLocal, localToIso } from '@shared/lib/format/DateTimeLocal'
import { useT } from '@shared/lib/i18n/I18n'

import type { VoucherInput } from '@features/vouchers/schemas/Voucher.schema'
import type { Voucher } from '@features/vouchers/types/Voucher.types'
import type { MessageKey } from '@shared/lib/i18n/I18n'

const ISSUE_KEYS: Record<string, MessageKey> = {
  percent: 'vouchers.invalid.percent',
  after: 'vouchers.invalid.after',
}

function toInput(voucher: Voucher): VoucherInput {
  return {
    code: voucher.code,
    type: voucher.type,
    value: voucher.value,
    maxDiscount: voucher.maxDiscount,
    minSubtotal: voucher.minSubtotal,
    totalLimit: voucher.totalLimit,
    perBuyerLimit: voucher.perBuyerLimit,
    startsAt: isoToLocal(voucher.startsAt),
    endsAt: isoToLocal(voucher.endsAt),
    isActive: voucher.isActive,
  }
}

/**
 * Tạo / sửa / xoá Voucher. Mã không đổi sau khi tạo. Voucher đã dùng (usedCount > 0) chỉ đổi được
 * thời gian kết thúc, giới hạn tổng (≥ đã dùng), giới hạn mỗi Người mua và trạng thái kích hoạt; không xoá được.
 */
export function useVoucherEditor() {
  const route = useRoute()
  const router = useRouter()
  const { can } = useAuth()
  const { t } = useT()
  const notify = useNotify()
  const confirm = useConfirm()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useVoucherQuery(id)
  const mutation = useSaveVoucherMutation(id)
  const removal = useDeleteVoucherMutation()
  const canWrite = computed(() => can('PRICING_VOUCHER_MANAGE'))
  const used = computed(() => (query.data.value?.usedCount ?? 0) > 0)
  const canDelete = computed(() => !!id.value && canWrite.value && !!query.data.value && !used.value)
  const { values, setValues, setErrors, errors, resetForm, meta } = useForm<VoucherInput>({
    initialValues: {
      code: '',
      type: 'PERCENT',
      value: 10,
      maxDiscount: null,
      minSubtotal: 0,
      totalLimit: null,
      perBuyerLimit: 1,
      startsAt: '',
      endsAt: '',
      isActive: true,
    },
  })
  const model = computed({
    get: () => values,
    set: (value: VoucherInput) => {
      setValues(value)
    },
  })
  useHydrateForm(
    query.data,
    () => meta.value.dirty,
    (data) => {
      resetForm({ values: toInput(data) })
    },
  )
  useUnsavedGuard(() => meta.value.dirty && canWrite.value)

  function body(input: VoucherInput) {
    const limits = { totalLimit: input.totalLimit, perBuyerLimit: input.perBuyerLimit, isActive: input.isActive }
    const endsAt = localToIso(input.endsAt)
    if (used.value) return { ...limits, endsAt }
    const terms = {
      ...limits,
      type: input.type,
      value: input.value,
      maxDiscount: input.type === 'PERCENT' ? input.maxDiscount : null,
      minSubtotal: input.minSubtotal,
      startsAt: localToIso(input.startsAt),
      endsAt,
    }
    return id.value ? terms : { ...terms, code: input.code.toUpperCase() }
  }

  async function submit() {
    if (!canWrite.value || mutation.isPending.value) return
    const parsed = voucherSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            issue.path.join('.'),
            t(ISSUE_KEYS[issue.message] ?? 'auth.validation.required'),
          ]),
        ),
      )
      return
    }
    setErrors({})
    try {
      await mutation.mutateAsync(body(parsed.data))
      resetForm({ values: parsed.data })
      notify.success('common.saved')
      await router.push('/vouchers')
    } catch (error) {
      if (isApiError(error) && error.status === 409 && !id.value) setErrors({ code: t('vouchers.codeTaken') })
      else if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }

  async function remove() {
    if (!canDelete.value || removal.isPending.value) return
    const accepted = await confirm({
      title: t('vouchers.deleteTitle', { code: values.code }),
      description: t('vouchers.deleteDescription'),
      confirmLabel: t('common.delete'),
      color: 'error',
    })
    if (!accepted) return
    try {
      await removal.mutateAsync(id.value)
      resetForm({ values })
      await router.push('/vouchers')
    } catch (error) {
      notify.error(error)
    }
  }

  return {
    model,
    errors,
    query,
    mutation,
    removal,
    id,
    canWrite,
    used,
    canDelete,
    submit,
    remove,
    cancel: () => router.push('/vouchers'),
  }
}
