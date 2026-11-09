<script setup lang="ts">
import { computed } from 'vue'

import FilterBar from '@shared/components/list/FilterBar.vue'
import FilterSelect from '@shared/components/list/FilterSelect.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ search: string; status?: string }>()
const emit = defineEmits<{ filter: [key: string, value: unknown] }>()
const { t } = useT()

const STATUSES = ['in-stock', 'low-stock', 'out-of-stock'] as const
const statusItems = computed(() => STATUSES.map((value) => ({ label: t(`inventory.status.${value}`), value })))
</script>

<template>
  <FilterBar>
    <ListSearch :modelValue="search" @update:modelValue="emit('filter', 'search', $event)" />
    <FilterSelect
      name="status"
      :label="t('common.status')"
      :modelValue="status"
      :items="statusItems"
      @update:modelValue="emit('filter', 'status', $event)"
    />
  </FilterBar>
</template>
