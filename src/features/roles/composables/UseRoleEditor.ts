import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { usePermissionsQuery, useRoleQuery, useSaveRoleMutation } from '@features/roles/api/Roles.api'
import { roleSchema } from '@features/roles/schemas/Role.schema'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { RoleInput } from '@features/roles/schemas/Role.schema'
export function useRoleEditor() {
  const route = useRoute()
  const router = useRouter()
  const { can } = useAuth()
  const { t } = useT()
  const notify = useNotify()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useRoleQuery(id)
  const permissions = usePermissionsQuery()
  const mutation = useSaveRoleMutation(id)
  const { values, setValues, setErrors, errors, resetForm, meta } = useForm({
    initialValues: { name: '', permissions: [] as string[] },
  })
  const model = computed({ get: () => values, set: (value: RoleInput) => setValues(value) })
  useHydrateForm(
    query.data,
    () => meta.value.dirty,
    (data) => {
      resetForm({ values: data })
    },
  )
  useUnsavedGuard(() => meta.value.dirty)
  async function submit() {
    if (!can('role:write') || mutation.isPending.value || permissions.isError.value || permissions.isPending.value)
      return
    const parsed = roleSchema.safeParse(values)
    if (!parsed.success) {
      setErrors({ name: t('auth.validation.required') })
      return
    }
    try {
      await mutation.mutateAsync(parsed.data)
      resetForm({ values: parsed.data })
      await router.push('/roles')
    } catch (error) {
      if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  return {
    model,
    errors,
    query,
    permissions,
    mutation,
    id,
    submit,
    cancel: () => router.push('/roles'),
  }
}
