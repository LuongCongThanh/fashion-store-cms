import { useFieldArray, useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useCategoriesQuery } from '@features/categories/UseCategories'
import { useMedia } from '@features/media/UseMedia'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import { useProductQuery, useSaveProductMutation } from '../api/ProductEditor.api'
import { productDraftSchema, productPublishSchema } from '../schemas/Product.schema'

import type { ProductInput } from '../schemas/Product.schema'
export function useProductEditor() {
  const notify = useNotify()
  const route = useRoute()
  const router = useRouter()
  const { can } = useAuth()
  const { t } = useT()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useProductQuery(id)
  const mutation = useSaveProductMutation(id)
  const categories = useCategoriesQuery()
  const media = useMedia()
  const initial: ProductInput = {
    name: '',
    description: '',
    brand: '',
    price: 0,
    comparePrice: 0,
    cost: 0,
    categoryIds: [],
    images: [],
    mainImageId: '',
    variants: [{ sku: '', size: '', color: '', price: 0, stock: 0 }],
    slug: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft',
  }
  const { values, setValues, setErrors, errors, resetForm, meta } = useForm({
    initialValues: initial,
  })
  const { replace: replaceVariants } = useFieldArray<ProductInput['variants'][number]>('variants')
  const model = computed({
    get: () => values,
    set: (value: ProductInput) => {
      const { variants, ...rest } = value
      setValues(rest)
      if (variants !== values.variants) replaceVariants(variants)
    },
  })
  useHydrateForm(
    query.data,
    () => meta.value.dirty,
    (data) => {
      resetForm({ values: { ...initial, ...data } })
    },
  )
  useUnsavedGuard(() => meta.value.dirty)
  async function submit(status: 'draft' | 'published') {
    if (!can('product:write') || mutation.isPending.value || media.uploading.value) return
    const parsed = (status === 'published' ? productPublishSchema : productDraftSchema).safeParse({
      ...values,
      status,
    })
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [issue.path.join('.'), t('auth.validation.required')]),
        ),
      )
      return
    }
    setErrors({})
    try {
      await mutation.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      await router.push('/products')
    } catch (error) {
      if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  watch(media.image, (image) => {
    if (image && !values.images.some((item) => item.id === image.id))
      setValues({ images: [...values.images, image], mainImageId: values.mainImageId || image.id })
  })
  async function upload(file: File) {
    if (values.images.length >= 10) {
      media.error.value = t('media.tooMany')
      media.canRetry.value = false
      return
    }
    await media.upload(file)
  }

  return {
    categories,
    media,
    upload,
    model,
    errors,
    query,
    mutation,
    id,
    submit,
    cancel: () => router.push('/products'),
  }
}
