import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useRolesQuery } from '@features/roles/UseRoles'
import { useAssignableStoresQuery, useSaveUserMutation, useUserQuery } from '@features/users/api/Users.api'
import { userSchema } from '@features/users/schemas/User.schema'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { UserInput } from '@features/users/schemas/User.schema'
export function useUserEditor() {
  const route = useRoute()
  const router = useRouter()
  const { can } = useAuth()
  const { t } = useT()
  const notify = useNotify()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useUserQuery(id)
  const roles = useRolesQuery({ page: 1, pageSize: 100 })
  const stores = useAssignableStoresQuery()
  const mutation = useSaveUserMutation(id)
  const initial: UserInput = { name: '', email: '', status: 'active', roleIds: [], storeIds: [] }
  const { values, setValues, setErrors, errors, resetForm, meta } = useForm({
    initialValues: initial,
  })
  const model = computed({ get: () => values, set: (value: UserInput) => setValues(value) })
  useHydrateForm(
    query.data,
    () => meta.value.dirty,
    (data) => {
      resetForm({ values: data })
    },
  )
  useUnsavedGuard(() => meta.value.dirty)
  async function submit() {
    if (
      !can('user:write') ||
      mutation.isPending.value ||
      roles.isPending.value ||
      stores.isPending.value ||
      roles.isError.value ||
      stores.isError.value
    )
      return
    const parsed = userSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), t('auth.validation.required')])),
      )
      return
    }
    try {
      await mutation.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      await router.push('/users')
    } catch (error) {
      if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  return {
    model,
    errors,
    query,
    roles,
    stores,
    mutation,
    id,
    submit,
    cancel: () => router.push('/users'),
  }
}
