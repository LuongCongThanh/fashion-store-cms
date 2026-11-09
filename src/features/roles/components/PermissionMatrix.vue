<script setup lang="ts">
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
function selected(keys: string[]) {
  return keys.length > 0 && keys.every((key) => props.modelValue.includes(key))
}
function toggle(keys: string[], checked: boolean) {
  const values = new Set(props.modelValue)
  for (const key of keys)
    if (checked) values.add(key)
    else values.delete(key)
  emit('update:modelValue', [...values])
}
</script>
<template>
  <table class="w-full border-collapse">
    <caption>
      {{
        t('roles.permissions')
      }}
    </caption>
    <thead>
      <tr>
        <th>{{ t('roles.resource') }}</th>
        <th v-for="action in actions" :key="action">
          <label>
            <input
              type="checkbox"
              :name="`column:${action}`"
              :checked="selected(keys(undefined, action))"
              @change="toggle(keys(undefined, action), ($event.target as HTMLInputElement).checked)"
            />{{ action }}</label
          >
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="resource in resources" :key="resource">
        <th>
          <label>
            <input
              type="checkbox"
              :name="`row:${resource}`"
              :checked="selected(keys(resource))"
              @change="toggle(keys(resource), ($event.target as HTMLInputElement).checked)"
            />{{ resource }}</label
          >
        </th>
        <td v-for="action in actions" :key="action">
          <input
            v-if="keys(resource, action).length"
            type="checkbox"
            :name="`permission:${keys(resource, action)[0]}`"
            :aria-label="`${resource}:${action}`"
            :checked="selected(keys(resource, action))"
            @change="toggle(keys(resource, action), ($event.target as HTMLInputElement).checked)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
