<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue'
import { computed } from 'vue'

import { useStoreScope } from '@features/StoreScope/UseStoreScope'
import { useT } from '@shared/lib/i18n/I18n'

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
      trailingIcon="i-lucide-chevrons-up-down"
      :label="current?.name ?? t('common.store')"
      class="max-w-40 min-w-0 sm:max-w-56"
      :ui="{ label: 'truncate' }"
    />
  </UDropdownMenu>
</template>
