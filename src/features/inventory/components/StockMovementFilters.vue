<script setup lang="ts">
import FilterBar from '@shared/components/list/FilterBar.vue'
import FilterDateRange from '@shared/components/list/FilterDateRange.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ params: { search: string; type?: string; from?: string; to?: string } }>()
const emit = defineEmits<{ filter: [key: string, value: unknown] }>()
const { t } = useT()
</script>
<template>
  <FilterBar>
    <ListSearch :modelValue="params.search" @update:modelValue="emit('filter', 'search', $event)" />
    <FilterDateRange
      :from="params.from"
      :to="params.to"
      @filter="(key, value) => emit('filter', key, value)"
    />
    <label
      >{{ t('inventory.type')
      }}<select
        name="type"
        :value="params.type ?? ''"
        @change="emit('filter', 'type', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">{{ t('common.all') }}</option>
        <option v-for="type in ['in', 'out', 'adjustment'] as const" :key="type" :value="type">
          {{ t(`inventory.types.${type}`) }}
        </option>
      </select>
    </label>
  </FilterBar>
</template>
