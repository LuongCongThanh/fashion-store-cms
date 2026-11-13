import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import {
  useDeleteRoleMutation,
  usePermissionGroupsQuery,
  useRoleQuery,
  useSaveRoleMutation,
} from '@features/roles/api/Roles.api'
import { roleSchema } from '@features/roles/schemas/Role.schema'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import { useHydrateForm } from '@shared/composables/UseHydrateForm'
import { useNotify } from '@shared/composables/UseNotify'
import { useUnsavedGuard } from '@shared/composables/UseUnsavedGuard'
import { isApiError } from '@shared/lib/api/errors/ApiError'
import { applyApiErrorToForm } from '@shared/lib/form/ApplyApiErrorToForm'
import { useT } from '@shared/lib/i18n/I18n'

import type { RoleInput } from '@features/roles/schemas/Role.schema'

export function useRoleEditor() {
  const route = useRoute()
  const router = useRouter()
  const { can } = useAuth()
  const { t } = useT()
  const notify = useNotify()
  const confirm = useConfirm()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useRoleQuery(id)
  const permissions = usePermissionGroupsQuery()
  const isSystem = computed(() => query.data.value?.isSystem ?? false)
  const mutation = useSaveRoleMutation(id, isSystem)
  const removal = useDeleteRoleMutation()
  /** Vai trò `Admin` hoặc người xem không có quyền sửa: chỉ xem. */
  const readOnly = computed(() => !can('ADMINISTRATION_ROLE_MANAGE') || (query.data.value?.isReadOnly ?? false))
  const canDelete = computed(() => !!id.value && !isSystem.value && can('ADMINISTRATION_ROLE_MANAGE'))
  const { values, setValues, setErrors, errors, resetForm, meta } = useForm<RoleInput>({
    initialValues: { name: '', description: '', permissions: [] },
  })
  const model = computed({
    get: () => values,
    set: (value: RoleInput) => {
      setValues(value)
    },
  })
  useHydrateForm(
    query.data,
    () => meta.value.dirty,
    (data) => {
      resetForm({ values: { name: data.name, description: data.description ?? '', permissions: data.permissions } })
    },
  )
  useUnsavedGuard(() => meta.value.dirty && !readOnly.value)
  async function submit() {
    if (readOnly.value || mutation.isPending.value || permissions.isError.value || permissions.isPending.value) return
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
      if (isApiError(error) && error.status === 409) setErrors({ name: t('roles.nameTaken') })
      else if (!applyApiErrorToForm(error, setErrors)) notify.error(error)
    }
  }
  async function remove() {
    if (!canDelete.value || removal.isPending.value) return
    const accepted = await confirm({
      title: t('roles.deleteTitle', { name: values.name }),
      description: t('roles.deleteDescription'),
      confirmLabel: t('common.delete'),
      color: 'error',
    })
    if (!accepted) return
    try {
      await removal.mutateAsync(id.value)
      resetForm({ values })
      await router.push('/roles')
    } catch (error) {
      notify.error(error)
    }
  }
  return {
    model,
    errors,
    query,
    permissions,
    mutation,
    removal,
    id,
    readOnly,
    nameLocked: isSystem,
    canDelete,
    submit,
    remove,
    cancel: () => router.push('/roles'),
  }
}
