<script setup lang="ts">
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import { computed } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { PermissionGroup } from '@features/roles/types/Role.types'
import type { Permission } from '@shared/lib/api/Permission'
import type { MessageKey } from '@shared/lib/i18n/I18n'

const props = defineProps<{ groups: PermissionGroup[]; modelValue: Permission[]; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: Permission[]] }>()
const { t, te } = useT()

/** `CATALOG_PRODUCT_OPTION_VIEW` trong nhóm `CATALOG` → tài nguyên `PRODUCT_OPTION`, hành động `VIEW`. */
function split(group: string, permission: Permission) {
  const rest = permission.startsWith(`${group}_`) ? permission.slice(group.length + 1) : permission
  const cut = rest.lastIndexOf('_')
  return cut < 0 ? { resource: rest, action: rest } : { resource: rest.slice(0, cut), action: rest.slice(cut + 1) }
}

const tables = computed(() =>
  props.groups.map(({ group, permissions }) => {
    const cells = permissions.map((permission) => ({ permission, ...split(group, permission) }))
    const resources = [...new Set(cells.map((cell) => cell.resource))]
    const actions = [...new Set(cells.map((cell) => cell.action))]
    const find = (resource?: string, action?: string) =>
      cells
        .filter((cell) => (!resource || cell.resource === resource) && (!action || cell.action === action))
        .map((cell) => cell.permission)
    return { group, resources, actions, find }
  }),
)

/** Nhãn i18n nếu có, không thì hiện nguyên mã do API trả (Quyền mới chưa dịch vẫn dùng được). */
function label(kind: 'groups' | 'resources' | 'actions', code: string) {
  const key = `roles.${kind}.${code}`
  return te(key) ? t(key as MessageKey) : code
}

/** Trạng thái checkbox nhóm: chọn hết, chọn một phần (indeterminate) hoặc chưa chọn. */
function state(keys: Permission[]): boolean | 'indeterminate' {
  const count = keys.filter((key) => props.modelValue.includes(key)).length
  if (keys.length > 0 && count === keys.length) return true
  return count > 0 ? 'indeterminate' : false
}
function toggle(keys: Permission[], checked: boolean | 'indeterminate') {
  const values = new Set(props.modelValue)
  for (const key of keys)
    if (checked === true) values.add(key)
    else values.delete(key)
  emit('update:modelValue', [...values])
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="table in tables" :key="table.group" class="overflow-x-auto rounded-lg border border-default">
      <table class="w-full text-sm">
        <caption class="bg-elevated px-3 py-2 text-left text-sm font-medium">
          {{
            label('groups', table.group)
          }}
        </caption>
        <thead class="text-xs text-muted">
          <tr>
            <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('roles.resource') }}</th>
            <th v-for="action in table.actions" :key="action" scope="col" class="px-3 py-2 text-left font-medium">
              <UCheckbox
                :id="`column:${table.group}:${action}`"
                :label="label('actions', action)"
                size="sm"
                :disabled="disabled"
                :modelValue="state(table.find(undefined, action))"
                @update:modelValue="toggle(table.find(undefined, action), $event)"
              />
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr v-for="resource in table.resources" :key="resource" class="hover:bg-elevated/50">
            <th scope="row" class="px-3 py-1.5 text-left font-normal">
              <UCheckbox
                :id="`row:${table.group}:${resource}`"
                :label="label('resources', resource)"
                size="sm"
                :disabled="disabled"
                :modelValue="state(table.find(resource))"
                @update:modelValue="toggle(table.find(resource), $event)"
              />
            </th>
            <td v-for="action in table.actions" :key="action" class="px-3 py-1.5">
              <UCheckbox
                v-for="permission in table.find(resource, action)"
                :id="`permission:${permission}`"
                :key="permission"
                size="sm"
                :disabled="disabled"
                :aria-label="`${label('resources', resource)}: ${label('actions', action)}`"
                :modelValue="modelValue.includes(permission)"
                @update:modelValue="toggle([permission], $event)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
