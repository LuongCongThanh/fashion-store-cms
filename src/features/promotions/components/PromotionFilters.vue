<script setup lang="ts">
import FilterBar from '@shared/components/list/FilterBar.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ search: string; status?: string; type?: string }>()
const emit = defineEmits<{ filter: [key: string, value: unknown] }>()
const { t } = useT()
</script>

<template>
  <FilterBar>
    <ListSearch :modelValue="search" @update:modelValue="emit('filter', 'search', $event)" />
    <label
      >{{ t('common.status')
      }}<select
        name="status"
        :value="status ?? ''"
        @change="emit('filter', 'status', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">{{ t('common.all') }}</option>
        <option v-for="value in ['draft', 'active', 'inactive'] as const" :key="value" :value="value">
          {{ t(`promotions.status.${value}`) }}
        </option>
      </select>
    </label>
    <label
      >{{ t('promotions.type')
      }}<select
        name="type"
        :value="type ?? ''"
        @change="emit('filter', 'type', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">{{ t('common.all') }}</option>
        <option v-for="value in ['coupon', 'auto'] as const" :key="value" :value="value">
          {{ t(`promotions.${value}`) }}
        </option>
      </select>
    </label>
  </FilterBar>
</template>
