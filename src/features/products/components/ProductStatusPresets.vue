<script setup lang="ts">
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import USkeleton from '@nuxt/ui/components/Skeleton.vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { ProductStatus } from '@features/products/types/Product.types'

interface ProductStatusPreset {
  status?: ProductStatus
  label: string
  count: string
  isPending: boolean
  to: { query: Record<string, string | null | (string | null)[] | undefined> }
}

defineProps<{ presets: ProductStatusPreset[]; activeStatus?: ProductStatus; hasError: boolean }>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useT()
</script>

<template>
  <div class="flex items-center gap-2">
    <nav
      class="flex min-w-0 flex-1 gap-1 overflow-x-auto border-b border-default"
      :aria-label="t('products.statusPresets.label')"
    >
      <RouterLink
        v-for="preset in presets"
        :key="preset.status ?? 'all'"
        :to="preset.to"
        class="-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :class="
          activeStatus === preset.status
            ? 'border-primary font-medium text-highlighted'
            : 'border-transparent text-muted'
        "
        :aria-current="activeStatus === preset.status ? 'page' : undefined"
      >
        {{ preset.label }}
        <USkeleton v-if="preset.isPending" class="h-5 w-8 rounded-full" />
        <UBadge v-else color="neutral" variant="soft" size="sm" class="tabular-nums">{{ preset.count }}</UBadge>
      </RouterLink>
    </nav>
    <UButton v-if="hasError" color="neutral" variant="outline" size="sm" @click="emit('retry')">
      {{ t('common.retry') }}
    </UButton>
  </div>
</template>
