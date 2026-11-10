<script setup lang="ts">
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import { computed } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { Permission } from '@features/roles/types/Role.types'
const props = defineProps<{ permissions: Permission[]; modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const { t } = useT()
const resources = computed(() => [...new Set(props.permissions.map((permission) => permission.resource))])
const actions = computed(() => [...new Set(props.permissions.map((permission) => permission.action))])
function keys(resource?: string, action?: string) {
  return props.permissions
    .filter(
      (permission) => (!resource || permission.resource === resource) && (!action || permission.action === action),
    )
    .map((permission) => permission.key)
}
/** Trạng thái checkbox nhóm: chọn hết, chọn một phần (indeterminate) hoặc chưa chọn. */
function state(keys: string[]): boolean | 'indeterminate' {
  const count = keys.filter((key) => props.modelValue.includes(key)).length
  if (keys.length > 0 && count === keys.length) return true
  return count > 0 ? 'indeterminate' : false
}
function toggle(keys: string[], checked: boolean | 'indeterminate') {
  const values = new Set(props.modelValue)
  for (const key of keys)
    if (checked === true) values.add(key)
    else values.delete(key)
  emit('update:modelValue', [...values])
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-default">
    <table class="w-full text-sm">
      <caption class="sr-only">
        {{
          t('roles.permissions')
        }}
      </caption>
      <thead class="bg-elevated text-xs text-muted">
        <tr>
          <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('roles.resource') }}</th>
          <th v-for="action in actions" :key="action" scope="col" class="px-3 py-2 text-left font-medium">
            <UCheckbox
              :id="`column:${action}`"
              :label="action"
              size="sm"
              :modelValue="state(keys(undefined, action))"
              @update:modelValue="toggle(keys(undefined, action), $event)"
            />
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-default">
        <tr v-for="resource in resources" :key="resource" class="hover:bg-elevated/50">
          <th scope="row" class="px-3 py-1.5 text-left font-normal">
            <UCheckbox
              :id="`row:${resource}`"
              :label="resource"
              size="sm"
              :modelValue="state(keys(resource))"
              @update:modelValue="toggle(keys(resource), $event)"
            />
          </th>
          <td v-for="action in actions" :key="action" class="px-3 py-1.5">
            <UCheckbox
              v-if="keys(resource, action).length"
              :id="`permission:${keys(resource, action)[0]}`"
              size="sm"
              :aria-label="`${resource}:${action}`"
              :modelValue="state(keys(resource, action))"
              @update:modelValue="toggle(keys(resource, action), $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
