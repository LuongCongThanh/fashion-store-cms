import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useCategoriesQuery } from '@features/categories/UseCategories'
import {
  useProductQuery,
  useProductStatusMutation,
  useUnarchiveProductMutation,
  useUpdateProductMutation,
} from '@features/products/api/ProductEditor.api'
import { productInfoSchema } from '@features/products/schemas/Product.schema'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { ProductInfoInput } from '@features/products/schemas/Product.schema'

import { EMPTY_PRODUCT_INFO } from './UseProductCreate'

/** Trang sửa: thông tin cơ bản (một nút Lưu) và vòng đời Sản phẩm (mỗi nút một lệnh API). */
export function useProductEditor() {
  const notify = useNotify()
  const confirm = useConfirm()
  const route = useRoute()
  const router = useRouter()
  const { t } = useT()
  const { can } = useAuth()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useProductQuery(id)
  const categories = useCategoriesQuery()
  const update = useUpdateProductMutation(id)
  const status = useProductStatusMutation(id)
  const unarchive = useUnarchiveProductMutation(id)
  const canWrite = computed(() => can('CATALOG_PRODUCT_MANAGE'))
  /** BR-CAT-01: mở bán khi có ít nhất một Biến thể đang bán. */
  const hasActiveVariant = computed(() => !!query.data.value?.variants.some((variant) => variant.status === 'ACTIVE'))
  const { values, errors, setValues, setErrors, resetForm, meta } = useForm({ initialValues: EMPTY_PRODUCT_INFO })
  const model = computed({
    get: () => values,
    set: (value: ProductInfoInput) => {
      setValues(value)
    },
  })
  useHydrateForm(
    query.data,
    () => meta.value.dirty,
    (product) => {
      resetForm({
        values: {
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          weightGrams: product.weightGrams,
        },
      })
    },
  )
  useUnsavedGuard(() => meta.value.dirty)

  async function save() {
    if (!canWrite.value || update.isPending.value) return
    const parsed = productInfoSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), t('auth.validation.required')])),
      )
      return
    }
    setErrors({})
    try {
      await update.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      notify.success('common.saved')
    } catch (error) {
      if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }

  async function publish() {
    if (!canWrite.value || !hasActiveVariant.value) return
    const accepted = await confirm({
      title: t('products.publishTitle', { name: values.name }),
      description: t('products.publishDescription'),
      confirmLabel: t('products.publish'),
    })
    if (accepted) status.mutate('ACTIVE')
  }

  async function archive() {
    if (!canWrite.value) return
    const accepted = await confirm({
      title: t('products.archiveTitle', { name: values.name }),
      description: t('products.archiveDescription'),
      confirmLabel: t('products.archive'),
      color: 'error',
    })
    if (accepted) status.mutate('ARCHIVED')
  }

  return {
    id,
    query,
    categories,
    model,
    errors,
    update,
    status,
    unarchive,
    canWrite,
    hasActiveVariant,
    save,
    publish,
    archive,
    restore: () => {
      unarchive.mutate()
    },
    back: () => router.push('/products'),
  }
}
