import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useSaveSizeMutation, useSizesQuery } from '@features/sizes/api/Sizes.api'
import { sizeSchema } from '@features/sizes/schemas/Size.schema'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { SizeInput } from '@features/sizes/schemas/Size.schema'

const INITIAL: SizeInput = { code: '', name: '', sortOrder: 0, isHidden: false }

export function useSizeEditor() {
  const notify = useNotify()
  const route = useRoute()
  const router = useRouter()
  const { t } = useT()
  const { can } = useAuth()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useSizesQuery()
  const current = computed(() => query.data.value?.find((size) => size.id === id.value))
  const notFound = computed(() => !!id.value && !!query.data.value && !current.value)
  const mutation = useSaveSizeMutation(id)
  const { values, errors, setValues, setErrors, resetForm, meta } = useForm({ initialValues: INITIAL })
  const model = computed({
    get: () => values,
    set: (value: SizeInput) => {
      setValues(value)
    },
  })
  useHydrateForm(
    current,
    () => meta.value.dirty,
    (size) => {
      resetForm({ values: { code: size.code, name: size.name, sortOrder: size.sortOrder, isHidden: size.isHidden } })
    },
  )
  useUnsavedGuard(() => meta.value.dirty)
  async function submit() {
    if (!can('CATALOG_PRODUCT_OPTION_MANAGE') || mutation.isPending.value) return
    const parsed = sizeSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), t('sizes.invalid')])))
      return
    }
    setErrors({})
    try {
      await mutation.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      await router.push('/sizes')
    } catch (error) {
      if (isApiError(error) && error.status === 409) setErrors({ code: t('sizes.codeTaken') })
      else if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  return { id, model, errors, query, notFound, mutation, submit, cancel: () => router.push('/sizes') }
}
