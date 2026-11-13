import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  useInternalAccountQuery,
  useRenameInternalAccountMutation,
  useSetInternalAccountStatusMutation,
  useToggleInternalAccountRoleMutation,
} from '@features/accounts/api/InternalAccounts.api'
import { renameInternalAccountSchema } from '@features/accounts/schemas/InternalAccount.schema'
import { useAuth } from '@features/auth/UseAuth'
import { useRolesQuery } from '@features/roles/UseRoles'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import { useNotify } from '@shared/composables/UseNotify'
import { useT } from '@shared/lib/i18n/I18n'

/**
 * Trang sửa Tài khoản nội bộ: đổi tên (nút Lưu), bật/tắt tài khoản và gán/gỡ Vai trò.
 * Mỗi lần tick Vai trò gọi API ngay; API thu hồi phiên của tài khoản đó.
 */
export function useInternalAccountEditor() {
  const route = useRoute()
  const router = useRouter()
  const { can } = useAuth()
  const { t } = useT()
  const notify = useNotify()
  const confirm = useConfirm()
  const id = computed(() => String(route.params.id ?? ''))
  const query = useInternalAccountQuery(id)
  const roles = useRolesQuery({ page: 1, pageSize: 100 })
  const rename = useRenameInternalAccountMutation(id)
  const status = useSetInternalAccountStatusMutation(id)
  const toggle = useToggleInternalAccountRoleMutation(id)
  const canWrite = computed(() => can('ADMINISTRATION_INTERNAL_ACCOUNT_MANAGE'))

  const name = ref('')
  const nameError = ref<string>()
  watch(
    () => query.data.value?.name,
    (value) => {
      if (value !== undefined) name.value = value
    },
    { immediate: true },
  )
  const nameDirty = computed(() => !!query.data.value && name.value.trim() !== query.data.value.name)

  async function saveName() {
    if (!canWrite.value || !nameDirty.value || rename.isPending.value) return
    const parsed = renameInternalAccountSchema.safeParse({ name: name.value })
    if (!parsed.success) {
      nameError.value = t('auth.validation.required')
      return
    }
    nameError.value = undefined
    try {
      await rename.mutateAsync(parsed.data)
      notify.success('common.saved')
    } catch (error) {
      notify.error(error)
    }
  }

  async function setStatus(next: 'ACTIVE' | 'DISABLED') {
    const account = query.data.value
    if (!canWrite.value || !account || status.isPending.value) return
    if (
      next === 'DISABLED' &&
      !(await confirm({
        title: t('internalAccounts.disableTitle', { name: account.name }),
        description: t('internalAccounts.disableDescription'),
        confirmLabel: t('internalAccounts.disable'),
        color: 'error',
      }))
    )
      return
    try {
      await status.mutateAsync(next)
    } catch (error) {
      notify.error(error)
    }
  }

  const pendingRoleId = ref<string>()
  async function toggleRole(roleId: string, assigned: boolean) {
    if (!canWrite.value || toggle.isPending.value) return
    pendingRoleId.value = roleId
    try {
      await toggle.mutateAsync({ roleId, assigned })
    } catch (error) {
      notify.error(error)
    } finally {
      pendingRoleId.value = undefined
    }
  }

  return {
    id,
    query,
    roles,
    canWrite,
    name,
    nameError,
    nameDirty,
    rename,
    status,
    pendingRoleId,
    saveName,
    setStatus,
    toggleRole,
    back: () => router.push('/internal-accounts'),
  }
}
