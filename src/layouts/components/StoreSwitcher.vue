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
  <div :class="collapsed ? 'flex justify-center' : 'space-y-1.5'">
    <p v-if="!collapsed" class="px-1 text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
      {{ t('common.currentStore') }}
    </p>
    <UDropdownMenu :items="items">
      <UButton
        icon="i-lucide-store"
        color="neutral"
        :variant="collapsed ? 'ghost' : 'outline'"
        :trailingIcon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
        :label="collapsed ? undefined : (current?.name ?? t('common.store'))"
        :aria-label="collapsed ? (current?.name ?? t('common.store')) : undefined"
        :block="!collapsed"
        :square="collapsed"
        :ui="{
          base: collapsed ? 'size-10' : 'h-10 justify-start bg-default',
          label: 'truncate text-left',
          leadingIcon: 'text-primary',
          trailingIcon: 'ms-auto text-dimmed',
        }"
      />
    </UDropdownMenu>
  </div>
</template>
