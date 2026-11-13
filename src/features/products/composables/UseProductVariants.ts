import { computed, reactive, ref, toValue, watch } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useColorsQuery } from '@features/colors/UseColors'
import { useCreateVariantMutation, useUpdateVariantMutation } from '@features/products/api/ProductEditor.api'
import { suggestSku, variantSchema } from '@features/products/schemas/Product.schema'
import { useSizesQuery } from '@features/sizes/UseSizes'
import { useNotify } from '@shared/composables/UseNotify'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { useT } from '@shared/lib/i18n/I18n'

import type { VariantInput } from '@features/products/schemas/Product.schema'
import type { ProductDetail, ProductVariant } from '@features/products/types/Product.types'

/**
 * Biến thể của một Sản phẩm: thêm từng Biến thể (size × màu, SKU gợi ý từ
 * slug), đổi giá, ngừng bán / bán lại. Mỗi thao tác là một lệnh API.
 */
export function useProductVariants(id: MaybeRefOrGetter<string>, product: MaybeRefOrGetter<ProductDetail | undefined>) {
  const notify = useNotify()
  const { t } = useT()
  const sizes = useSizesQuery()
  const colors = useColorsQuery()
  const create = useCreateVariantMutation(id)
  const update = useUpdateVariantMutation(id)
  const draft = reactive<VariantInput>({ sizeId: '', colorId: '', sku: '', price: 0 })
  const errors = ref<Partial<Record<keyof VariantInput, string>>>({})
  /** Người dùng tự gõ SKU thì không ghi đè bằng gợi ý nữa. */
  const skuTouched = ref(false)
  /** Giá đang sửa theo id Biến thể; bằng giá hiện tại nghĩa là không có gì để lưu. */
  const prices = reactive<Record<string, number>>({})

  const selectableSizes = computed(() => (sizes.data.value ?? []).filter((size) => !size.isHidden))
  const selectableColors = computed(() => (colors.data.value ?? []).filter((color) => !color.isHidden))
  const taken = computed(
    () => new Set((toValue(product)?.variants ?? []).map((variant) => `${variant.size.id}:${variant.color.id}`)),
  )

  watch(
    () => [draft.sizeId, draft.colorId, toValue(product)?.slug] as const,
    ([sizeId, colorId, slug]) => {
      if (skuTouched.value) return
      const size = selectableSizes.value.find((item) => item.id === sizeId)
      const color = selectableColors.value.find((item) => item.id === colorId)
      draft.sku = size && color && slug ? suggestSku(slug, color.code, size.code) : ''
    },
  )

  function setSku(value: string) {
    skuTouched.value = true
    draft.sku = value.toUpperCase()
  }

  async function add() {
    if (create.isPending.value) return
    const parsed = variantSchema.safeParse(draft)
    const next: Partial<Record<keyof VariantInput, string>> = {}
    if (!parsed.success)
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof VariantInput] = t('products.variantInvalid')
    if (taken.value.has(`${draft.sizeId}:${draft.colorId}`)) next.colorId = t('products.variantExists')
    errors.value = next
    if (!parsed.success || Object.keys(next).length) return
    try {
      await create.mutateAsync(parsed.data)
      Object.assign(draft, { sizeId: '', sku: '' })
      skuTouched.value = false
    } catch (error) {
      if (isApiError(error) && error.status === 409) errors.value = { sku: t('products.skuTaken') }
      else notify.error(error)
    }
  }

  async function savePrice(variant: ProductVariant) {
    const price = prices[variant.id]
    if (price === undefined || price === variant.price) return
    if (!Number.isInteger(price) || price < 1) return
    try {
      await update.mutateAsync({ variantId: variant.id, price })
    } catch (error) {
      notify.error(error)
    }
  }

  function setArchived(variant: ProductVariant, archived: boolean) {
    update.mutate(
      { variantId: variant.id, archived },
      {
        onError: (error) => {
          notify.error(error)
        },
      },
    )
  }

  return {
    sizes,
    colors,
    selectableSizes,
    selectableColors,
    draft,
    errors,
    prices,
    create,
    update,
    add,
    setSku,
    savePrice,
    setArchived,
  }
}
