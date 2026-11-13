import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useCategoriesQuery } from '@features/categories/UseCategories'
import { useCreateProductMutation } from '@features/products/api/ProductEditor.api'
import { productInfoSchema } from '@features/products/schemas/Product.schema'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { ProductInfoInput } from '@features/products/schemas/Product.schema'

export const EMPTY_PRODUCT_INFO: ProductInfoInput = { name: '', description: '', categoryId: '', weightGrams: 200 }

/** Tạo Sản phẩm (DRAFT) với thông tin cơ bản rồi chuyển sang trang sửa để thêm Biến thể và ảnh. */
export function useProductCreate() {
  const notify = useNotify()
  const router = useRouter()
  const { t } = useT()
  const { can } = useAuth()
  const categories = useCategoriesQuery()
  const mutation = useCreateProductMutation()
  const { values, errors, setValues, setErrors, resetForm, meta } = useForm({ initialValues: EMPTY_PRODUCT_INFO })
  const model = computed({
    get: () => values,
    set: (value: ProductInfoInput) => {
      setValues(value)
    },
  })
  useUnsavedGuard(() => meta.value.dirty)
  async function submit() {
    if (!can('CATALOG_PRODUCT_MANAGE') || mutation.isPending.value) return
    const parsed = productInfoSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), t('auth.validation.required')])),
      )
      return
    }
    setErrors({})
    try {
      const product = await mutation.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      await router.push(`/products/${encodeURIComponent(product.id)}/edit`)
    } catch (error) {
      if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  return { model, errors, categories, mutation, submit, cancel: () => router.push('/products') }
}
