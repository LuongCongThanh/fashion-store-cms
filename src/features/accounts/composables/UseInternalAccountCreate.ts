import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useCreateInternalAccountMutation } from '@features/accounts/api/InternalAccounts.api'
import { createInternalAccountSchema } from '@features/accounts/schemas/InternalAccount.schema'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { CreateInternalAccountInput } from '@features/accounts/schemas/InternalAccount.schema'

/** Tạo tài khoản rồi chuyển sang trang sửa — nơi duy nhất gán Vai trò. */
export function useInternalAccountCreate() {
  const router = useRouter()
  const { t } = useT()
  const notify = useNotify()
  const mutation = useCreateInternalAccountMutation()
  const { values, setValues, setErrors, errors, resetForm, meta } = useForm<CreateInternalAccountInput>({
    initialValues: { name: '', email: '', password: '' },
  })
  const model = computed({
    get: () => values,
    set: (value: CreateInternalAccountInput) => {
      setValues(value)
    },
  })
  useUnsavedGuard(() => meta.value.dirty)
  async function submit() {
    if (mutation.isPending.value) return
    const parsed = createInternalAccountSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), t('auth.validation.required')])),
      )
      return
    }
    try {
      const account = await mutation.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      await router.push(`/internal-accounts/${encodeURIComponent(account.id)}/edit`)
    } catch (error) {
      if (isApiError(error) && error.status === 409) setErrors({ email: t('internalAccounts.emailTaken') })
      else if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  return { model, errors, mutation, submit, cancel: () => router.push('/internal-accounts') }
}
