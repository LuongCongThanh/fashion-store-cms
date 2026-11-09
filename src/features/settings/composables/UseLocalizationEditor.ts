import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { useAuth } from '@features/auth/UseAuth'
import { useLocalizationQuery, useSaveLocalizationMutation } from '@features/settings/api/Settings.api'
import { localizationSchema } from '@features/settings/schemas/Settings.schema'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { LocalizationInput } from '@features/settings/schemas/Settings.schema'
export function useLocalizationEditor() {
  const { can } = useAuth()
  const { t } = useT()
  const notify = useNotify()
  const query = useLocalizationQuery()
  const mutation = useSaveLocalizationMutation()
  const initial: LocalizationInput = {
    languages: ['vi', 'en'],
    defaultLanguage: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'vi-VN',
  }
  const { values, setValues, setErrors, errors, resetForm, meta } = useForm({
    initialValues: initial,
  })
  const model = computed({
    get: () => values,
    set: (value: LocalizationInput) => {
      setValues(value)
    },
  })
  useHydrateForm(
    query.data,
    () => meta.value.dirty,
    (data) => {
      resetForm({ values: data })
    },
  )
  useUnsavedGuard(() => meta.value.dirty)
  async function submit() {
    if (!can('settings:write') || mutation.isPending.value) return
    const parsed = localizationSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), t('settings.invalid')])))
      return
    }
    try {
      await mutation.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      notify.success('common.saved')
    } catch (error) {
      if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  return {
    model,
    errors,
    query,
    mutation,
    submit,
    canWrite: computed(() => can('settings:write')),
    cancel: () => {
      resetForm()
    },
  }
}
