<script setup lang="ts" generic="T extends { id: string }">
import UTable from '@nuxt/ui/components/Table.vue'
import { computed } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import ErrorState from '@shared/components/feedback/ErrorState.vue'
import { useT } from '@shared/lib/i18n/I18n'
type RowSelectionState = Record<string, boolean>
type VisibilityState = Record<string, boolean>
type SortingState = { id: string; desc: boolean }[]

const props = defineProps<{
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  error?: unknown
  sort?: string
  selection?: RowSelectionState
  visibility?: VisibilityState
}>()
const emit = defineEmits<{
  sort: [value: string]
  'update:selection': [value: RowSelectionState]
  'update:visibility': [value: VisibilityState]
  retry: []
}>()
const { t } = useT()

// DESIGN.md mục Bảng: compact (row ~36px), thead dính, bảng cuộn trong khung của nó (trang không cuộn ngang).
const TABLE_UI = {
  root: 'max-h-[calc(100dvh-16rem)] overflow-auto rounded-lg border border-default',
  thead: 'bg-elevated',
  th: 'py-2 text-xs font-medium text-muted whitespace-nowrap',
  td: 'py-1.5 text-sm',
}

const sorting = computed<SortingState>({
  get: () =>
    props.sort &&
    props.columns.some(
      (column) =>
        column.id === props.sort?.replace(/^-/, '') ||
        ('accessorKey' in column && column.accessorKey === props.sort?.replace(/^-/, '')),
    )
      ? [{ id: props.sort.replace(/^-/, ''), desc: props.sort.startsWith('-') }]
      : [],
  set: (value) => {
    emit('sort', value[0] ? `${value[0].desc ? '-' : ''}${value[0].id}` : '')
  },
})
const selected = computed({
  get: () => props.selection ?? {},
  set: (value) => {
    emit('update:selection', value)
  },
})
const visible = computed({
  get: () => props.visibility ?? {},
  set: (value) => {
    emit('update:visibility', value)
  },
})
</script>

<template>
  <ErrorState v-if="error" :error="error" @retry="emit('retry')" />
  <UTable
    v-else
    v-model:sorting="sorting"
    v-model:rowSelection="selected"
    v-model:columnVisibility="visible"
    :data="data"
    :columns="columns"
    :loading="loading"
    :empty="t('common.empty')"
    :getRowId="(row) => row.id"
    :manualPagination="true"
    :manualSorting="true"
    :manualFiltering="true"
    sticky="header"
    :ui="TABLE_UI"
    class="w-full"
  />
</template>
