<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import { computed } from 'vue'

import FilterBar from '@shared/components/list/FilterBar.vue'
import FilterSelect from '@shared/components/list/FilterSelect.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ search: string; status?: string; roleId?: string }>()
const emit = defineEmits<{ filter: [key: string, value: unknown] }>()
const { t } = useT()

const statusItems = computed(() => [
  { label: t('common.active'), value: 'active' },
  { label: t('common.inactive'), value: 'inactive' },
])
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
    <UFormField :label="t('roles.title')" name="roleId" size="sm">
      <UInput
        name="roleId"
        :modelValue="roleId"
        @change="emit('filter', 'roleId', ($event.target as HTMLInputElement).value)"
      />
    </UFormField>
  </FilterBar>
</template>
