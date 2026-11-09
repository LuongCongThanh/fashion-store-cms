<script setup lang="ts">
import FilterBar from '@shared/components/list/FilterBar.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ search: string; status?: string; roleId?: string }>()
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
        <option value="active">{{ t('common.active') }}</option>
        <option value="inactive">{{ t('common.inactive') }}</option>
      </select>
    </label>
    <label
      >{{ t('roles.title')
      }}<input
        name="roleId"
        :value="roleId"
        @change="emit('filter', 'roleId', ($event.target as HTMLInputElement).value)"
      />
    </label>
  </FilterBar>
</template>
