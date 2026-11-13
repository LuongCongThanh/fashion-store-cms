import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useColorsQuery, useSaveColorMutation } from '@features/colors/api/Colors.api'
import { colorSchema } from '@features/colors/schemas/Color.schema'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { ColorInput } from '@features/colors/schemas/Color.schema'

const INITIAL: ColorInput = { code: '', name: '', hex: '#000000', isHidden: false }

export function useColorEditor() {
  const notify = useNotify()
  const route = useRoute()
  const router = useRouter()
  const { t } = useT()
  const { can } = useAuth()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useColorsQuery()
  const current = computed(() => query.data.value?.find((color) => color.id === id.value))
  const notFound = computed(() => !!id.value && !!query.data.value && !current.value)
  const mutation = useSaveColorMutation(id)
  const { values, errors, setValues, setErrors, resetForm, meta } = useForm({ initialValues: INITIAL })
  const model = computed({
    get: () => values,
    set: (value: ColorInput) => {
      setValues(value)
    },
  })
  useHydrateForm(
    current,
    () => meta.value.dirty,
    (color) => {
      resetForm({ values: { code: color.code, name: color.name, hex: color.hex, isHidden: color.isHidden } })
    },
  )
  useUnsavedGuard(() => meta.value.dirty)
  async function submit() {
    if (!can('CATALOG_PRODUCT_OPTION_MANAGE') || mutation.isPending.value) return
    const parsed = colorSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), t('colors.invalid')])))
      return
    }
    setErrors({})
    try {
      await mutation.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      await router.push('/colors')
    } catch (error) {
      if (isApiError(error) && error.status === 409) setErrors({ code: t('colors.codeTaken') })
      else if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  return { id, model, errors, query, notFound, mutation, submit, cancel: () => router.push('/colors') }
}
