<script setup lang="ts">
import { computed } from 'vue'

import FilterBar from '@shared/components/list/FilterBar.vue'
import FilterDateRange from '@shared/components/list/FilterDateRange.vue'
import FilterSelect from '@shared/components/list/FilterSelect.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ params: { search: string; type?: string; from?: string; to?: string } }>()
const emit = defineEmits<{ filter: [key: string, value: unknown] }>()
const { t } = useT()

const TYPES = ['in', 'out', 'adjustment'] as const
const typeItems = computed(() => TYPES.map((value) => ({ label: t(`inventory.types.${value}`), value })))
</script>

<template>
  <FilterBar>
    <ListSearch :modelValue="params.search" @update:modelValue="emit('filter', 'search', $event)" />
    <FilterDateRange :from="params.from" :to="params.to" @filter="(key, value) => emit('filter', key, value)" />
    <FilterSelect
      name="type"
      :label="t('inventory.type')"
      :modelValue="params.type"
      :items="typeItems"
      @update:modelValue="emit('filter', 'type', $event)"
    />
  </FilterBar>
</template>
