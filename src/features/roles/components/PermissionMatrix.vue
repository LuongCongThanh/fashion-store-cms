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
function moveFocus(event: KeyboardEvent) {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
  const input = event.currentTarget as HTMLInputElement
  const cell = input.closest('td')
  const row = input.closest('tr')
  if (!cell || !row) return
  const table = row.closest('table')
  const rows = [...(table?.querySelectorAll('tbody tr') ?? [])]
  const cells = [...row.querySelectorAll('td')]
  const rowIndex = rows.indexOf(row)
  const columnIndex = cells.indexOf(cell)
  const target =
    event.key === 'ArrowLeft'
      ? cells[columnIndex - 1]
      : event.key === 'ArrowRight'
        ? cells[columnIndex + 1]
        : rows[rowIndex + (event.key === 'ArrowUp' ? -1 : 1)]?.querySelectorAll('td')[columnIndex]
  const targetInput = target?.querySelector<HTMLInputElement>('input')
  if (targetInput) {
    event.preventDefault()
    targetInput.focus()
  }
}
</script>

<template>
  <div class="max-w-full overflow-auto rounded-lg border border-default">
    <table class="min-w-max border-collapse">
      <caption>
        {{
          t('roles.permissions')
        }}
      </caption>
      <thead>
        <tr>
          <th class="sticky top-0 left-0 z-20 bg-elevated p-3 text-left">{{ t('roles.resource') }}</th>
          <th v-for="action in actions" :key="action" class="sticky top-0 z-10 bg-elevated p-3">
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
          <th class="sticky left-0 z-10 bg-default p-3 text-left">
            <label>
              <input
                type="checkbox"
                :name="`row:${resource}`"
                :checked="selected(keys(resource))"
                @change="toggle(keys(resource), ($event.target as HTMLInputElement).checked)"
              />{{ resource }}</label
            >
          </th>
          <td v-for="action in actions" :key="action" class="p-3 text-center">
            <input
              v-if="keys(resource, action).length"
              type="checkbox"
              :name="`permission:${keys(resource, action)[0]}`"
              :aria-label="`${resource}:${action}`"
              :checked="selected(keys(resource, action))"
              @change="toggle(keys(resource, action), ($event.target as HTMLInputElement).checked)"
              @keydown="moveFocus"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
