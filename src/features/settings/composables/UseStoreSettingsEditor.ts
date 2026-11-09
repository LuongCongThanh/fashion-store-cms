import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'

import { useAuth } from '@features/auth/UseAuth'
import { useMedia } from '@features/media/UseMedia'
import { useSaveStoreSettingsMutation, useStoreSettingsQuery } from '@features/settings/api/Settings.api'
import { storeSettingsSchema } from '@features/settings/schemas/Settings.schema'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { StoreSettingsInput } from '@features/settings/schemas/Settings.schema'
export function useStoreSettingsEditor() {
  const { can } = useAuth()
  const { t } = useT()
  const notify = useNotify()
  const query = useStoreSettingsQuery()
  const mutation = useSaveStoreSettingsMutation()
  const media = useMedia()
  const initial: StoreSettingsInput = {
    name: '',
    logo: null,
    description: '',
    contactEmail: '',
    phone: '',
    address: '',
  }
  const { values, setValues, setErrors, errors, resetForm, meta } = useForm({
    initialValues: initial,
  })
  const model = computed({
    get: () => values,
    set: (value: StoreSettingsInput) => {
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
    const parsed = storeSettingsSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), t('auth.validation.required')])),
      )
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
  watch(media.image, (image) => {
    if (image) setValues({ logo: image })
  })
  async function upload(file: File) {
    if (can('settings:write')) await media.upload(file)
  }

  return {
    model,
    errors,
    query,
    mutation,
    media,
    submit,
    upload,
    canWrite: computed(() => can('settings:write')),
    cancel: () => {
      resetForm()
    },
  }
}
