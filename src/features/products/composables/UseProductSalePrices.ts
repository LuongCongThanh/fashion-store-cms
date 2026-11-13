import { computed, reactive, ref, toValue, watch } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useAuth } from '@features/auth/UseAuth'
import {
  useCreateSalePriceMutation,
  useDeleteSalePriceMutation,
  useEndSalePriceMutation,
  useSalePricesQuery,
  useUpdateSalePriceMutation,
} from '@features/products/api/SalePrices.api'
import {
  discountPercent,
  isoToLocal,
  localToIso,
  salePriceFormSchema,
} from '@features/products/schemas/SalePrice.schema'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import { useNotify } from '@shared/composables/UseNotify'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { useT } from '@shared/lib/i18n/I18n'

import type { SalePriceFormInput } from '@features/products/schemas/SalePrice.schema'
import type { ProductDetail } from '@features/products/types/Product.types'
import type { SalePrice } from '@features/products/types/SalePrice.types'
import type { SalePriceEdit, SalePriceFormErrors, SalePriceRow } from '@features/products/types/SalePriceView.types'

/**
 * Khối Giá khuyến mãi trên trang sửa Sản phẩm (US-804). Đặt cho một, vài hoặc mọi Biến thể đang bán,
 * theo số tiền hoặc % giảm; sửa / kết thúc / xoá theo trạng thái (BR-PRC-06).
 */
export function useProductSalePrices(
  productId: MaybeRefOrGetter<string>,
  product: MaybeRefOrGetter<ProductDetail | undefined>,
) {
  const { can } = useAuth()
  const { t } = useT()
  const notify = useNotify()
  const confirm = useConfirm()
  const canView = computed(() => can('PRICING_SALE_PRICE_VIEW'))
  const canWrite = computed(() => can('PRICING_SALE_PRICE_MANAGE'))
  const query = useSalePricesQuery(productId, canView)
  const create = useCreateSalePriceMutation(productId)
  const update = useUpdateSalePriceMutation(productId)
  const end = useEndSalePriceMutation(productId)
  const remove = useDeleteSalePriceMutation(productId)

  const activeVariants = computed(() => (toValue(product)?.variants ?? []).filter((v) => v.status === 'ACTIVE'))
  const form = reactive<SalePriceFormInput>({ variantIds: [], mode: 'percent', amount: 10, startsAt: '', endsAt: '' })
  const errors = ref<SalePriceFormErrors>({})
  const editing = ref<SalePriceEdit | null>(null)
  const editError = ref<string>()

  // Mặc định chọn mọi Biến thể đang bán ("toàn bộ Biến thể", US-804 AC1).
  watch(
    () => activeVariants.value.map((v) => v.id).join(','),
    () => {
      form.variantIds = activeVariants.value.map((v) => v.id)
    },
    { immediate: true },
  )

  const rows = computed<SalePriceRow[]>(() => {
    const variants = new Map((toValue(product)?.variants ?? []).map((v) => [v.id, v]))
    return (query.data.value ?? []).map((sale) => {
      const variant = variants.get(sale.variantId)
      return { sale, variant, discount: variant ? discountPercent(variant.price, sale.price) : null }
    })
  })

  async function submit() {
    if (create.isPending.value) return
    const parsed = salePriceFormSchema.safeParse(form)
    const next: SalePriceFormErrors = {}
    if (!parsed.success)
      for (const issue of parsed.error.issues)
        next[issue.path[0] as keyof SalePriceFormInput] = t(
          issue.message === 'percent'
            ? 'salePrices.invalid.percent'
            : issue.message === 'after'
              ? 'salePrices.invalid.after'
              : 'salePrices.invalid.required',
        )
    errors.value = next
    if (!parsed.success) return
    const { variantIds, mode, amount, startsAt, endsAt } = parsed.data
    try {
      await create.mutateAsync({
        variantIds,
        ...(mode === 'price' ? { price: amount } : { percentOff: amount }),
        ...(startsAt ? { startsAt: localToIso(startsAt) } : {}),
        endsAt: localToIso(endsAt),
      })
      Object.assign(form, { startsAt: '', endsAt: '' })
      notify.success('salePrices.created')
    } catch (error) {
      errors.value = { form: apiMessage(error) }
    }
  }

  function startEdit(sale: SalePrice) {
    editError.value = undefined
    editing.value = {
      id: sale.id,
      price: sale.price,
      startsAt: isoToLocal(sale.startsAt),
      endsAt: isoToLocal(sale.endsAt),
    }
  }

  async function saveEdit(sale: SalePrice) {
    const draft = editing.value
    if (!draft || update.isPending.value) return
    try {
      await update.mutateAsync(
        sale.status === 'ACTIVE'
          ? { id: sale.id, endsAt: localToIso(draft.endsAt) }
          : { id: sale.id, price: draft.price, startsAt: localToIso(draft.startsAt), endsAt: localToIso(draft.endsAt) },
      )
      editing.value = null
    } catch (error) {
      editError.value = apiMessage(error)
    }
  }

  async function endNow(row: SalePriceRow) {
    const accepted = await confirm({
      title: t('salePrices.endTitle', { sku: row.variant?.sku ?? '' }),
      description: t('salePrices.endDescription'),
      confirmLabel: t('salePrices.endNow'),
      color: 'error',
    })
    if (accepted)
      end.mutate(row.sale.id, {
        onError: (error) => {
          notify.error(error)
        },
      })
  }

  async function removeUpcoming(row: SalePriceRow) {
    const accepted = await confirm({
      title: t('salePrices.deleteTitle', { sku: row.variant?.sku ?? '' }),
      description: t('salePrices.deleteDescription'),
      confirmLabel: t('common.delete'),
      color: 'error',
    })
    if (accepted)
      remove.mutate(row.sale.id, {
        onError: (error) => {
          notify.error(error)
        },
      })
  }

  /** 409 trùng thời gian / 400 giá không hợp lệ có thông điệp riêng; còn lại dùng thông điệp chung. */
  function apiMessage(error: unknown): string {
    if (isApiError(error) && error.status === 409) return t('salePrices.conflict')
    if (isApiError(error) && error.status === 400) return t('salePrices.rejected')
    notify.error(error)
    return ''
  }

  return {
    canView,
    canWrite,
    query,
    activeVariants,
    form,
    errors,
    rows,
    editing,
    editError,
    create,
    update,
    submit,
    startEdit,
    saveEdit,
    cancelEdit: () => (editing.value = null),
    endNow,
    removeUpcoming,
  }
}
