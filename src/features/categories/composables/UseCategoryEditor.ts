import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import { useCategoriesQuery } from '../api/Categories.api'
import { useCategoryDetailQuery, useSaveCategoryMutation } from '../api/CategoryEditor.api'
import { categorySchema } from '../schemas/Category.schema'
import { categoryParentOptions } from '../schemas/CategoryTree'

import type { CategoryInput } from '../schemas/Category.schema'
export function useCategoryEditor() {
  const notify = useNotify()
  const route = useRoute()
  const router = useRouter()
  const { t } = useT()
  const { can } = useAuth()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useCategoryDetailQuery(id)
  const categories = useCategoriesQuery()
  const parentOptions = computed(() => categoryParentOptions(categories.data.value ?? [], id.value))
  const mutation = useSaveCategoryMutation(id)
  const initial: CategoryInput = {
    name: '',
    slug: '',
    parentId: null,
    metaTitle: '',
    metaDescription: '',
    translations: { vi: { name: '', description: '' }, en: { name: '', description: '' } },
  }
  const { values, errors, setValues, setErrors, resetForm, meta } = useForm({
    initialValues: initial,
  })
  const model = computed({ get: () => values, set: (value: CategoryInput) => setValues(value) })
  useHydrateForm(
    query.data,
    () => meta.value.dirty,
    (data) => {
      resetForm({
        values: {
          ...initial,
          ...data,
          translations: { ...initial.translations, ...data.translations },
        },
      })
    },
  )
  useUnsavedGuard(() => meta.value.dirty)
  async function submit() {
    if (!can('category:write') || mutation.isPending.value) return
    if (
      values.parentId &&
      !parentOptions.value.some((category) => category.id === values.parentId)
    ) {
      setErrors({ parentId: t('categories.invalidParent') })
      return
    }
    const parsed = categorySchema.safeParse(values)
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
      await router.push('/categories')
    } catch (error) {
      if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  return {
    parentOptions,
    model,
    errors,
    query,
    categories,
    mutation,
    submit,
    id,
    cancel: () => router.push('/categories'),
  }
}
