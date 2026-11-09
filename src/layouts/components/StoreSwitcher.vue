<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue'
import { computed } from 'vue'

import { useStoreScope } from '@features/StoreScope/UseStoreScope'
import { useT } from '@shared/lib/i18n/I18n'

defineProps<{ collapsed?: boolean }>()

const { t } = useT()
const { current, stores, storeId, switchStore } = useStoreScope()

const items = computed(() =>
  stores.value.map((store) => ({
    label: store.name,
    type: 'checkbox' as const,
    checked: store.id === storeId.value,
    onSelect: () => void switchStore(store.id),
  })),
)
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      icon="i-lucide-store"
      color="neutral"
      variant="ghost"
      :trailingIcon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
      :label="collapsed ? undefined : (current?.name ?? t('common.store'))"
      :aria-label="collapsed ? (current?.name ?? t('common.store')) : undefined"
      :block="!collapsed"
      :square="collapsed"
      :ui="{ label: 'truncate', trailingIcon: 'ms-auto' }"
    />
  </UDropdownMenu>
</template>
