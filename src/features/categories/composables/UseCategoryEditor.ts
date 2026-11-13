import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useCategoriesQuery } from '@features/categories/api/Categories.api'
import {
  useCategoryDetailQuery,
  useDeleteCategoryMutation,
  useSaveCategoryMutation,
} from '@features/categories/api/CategoryEditor.api'
import { categorySchema } from '@features/categories/schemas/Category.schema'
import { categoryParentOptions } from '@features/categories/schemas/CategoryTree'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { CategoryInput } from '@features/categories/schemas/Category.schema'

const INITIAL: CategoryInput = { name: '', description: '', parentId: null, sortOrder: 0, isVisible: true }

export function useCategoryEditor() {
  const notify = useNotify()
  const confirm = useConfirm()
  const route = useRoute()
  const router = useRouter()
  const { t } = useT()
  const { can } = useAuth()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useCategoryDetailQuery(id)
  const categories = useCategoriesQuery()
  const parentOptions = computed(() => categoryParentOptions(categories.data.value ?? [], id.value))
  const mutation = useSaveCategoryMutation(id)
  const removal = useDeleteCategoryMutation()
  const canDelete = computed(() => !!id.value && can('CATALOG_CATEGORY_MANAGE'))
  /** API trả 409 khi còn danh mục con hoặc Sản phẩm: nói rõ lý do thay vì toast lỗi chung. */
  const deleteBlocked = ref(false)
  const { values, errors, setValues, setErrors, resetForm, meta } = useForm({ initialValues: INITIAL })
  const model = computed({
    get: () => values,
    set: (value: CategoryInput) => {
      setValues(value)
    },
  })
  useHydrateForm(
    query.data,
    () => meta.value.dirty,
    (data) => {
      resetForm({
        values: {
          name: data.name,
          description: data.description ?? '',
          parentId: data.parentId,
          sortOrder: data.sortOrder,
          isVisible: data.isVisible,
        },
      })
    },
  )
  useUnsavedGuard(() => meta.value.dirty)
  async function submit() {
    if (!can('CATALOG_CATEGORY_MANAGE') || mutation.isPending.value) return
    if (values.parentId && !parentOptions.value.some((category) => category.id === values.parentId)) {
      setErrors({ parentId: t('categories.invalidParent') })
      return
    }
    const parsed = categorySchema.safeParse(values)
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), t('auth.validation.required')])),
      )
      return
    }
    setErrors({})
    try {
      await mutation.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      await router.push('/categories')
    } catch (error) {
      if (isApiError(error) && error.status === 409) setErrors({ name: t('categories.nameTaken') })
      else if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  async function remove() {
    if (!canDelete.value || removal.isPending.value) return
    const accepted = await confirm({
      title: t('categories.deleteTitle', { name: values.name }),
      description: t('categories.deleteDescription'),
      confirmLabel: t('common.delete'),
      color: 'error',
    })
    if (!accepted) return
    deleteBlocked.value = false
    try {
      await removal.mutateAsync(id.value)
      resetForm({ values })
      await router.push('/categories')
    } catch (error) {
      if (isApiError(error) && error.status === 409) deleteBlocked.value = true
      else notify.error(error)
    }
  }
  return {
    deleteBlocked,
    parentOptions,
    model,
    errors,
    query,
    categories,
    mutation,
    removal,
    canDelete,
    submit,
    remove,
    id,
    cancel: () => router.push('/categories'),
  }
}
