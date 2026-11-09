<script setup lang="ts">
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import USkeleton from '@nuxt/ui/components/Skeleton.vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { ProductStatus } from '@features/products/types/Product.types'

export interface ProductSavedView {
  status?: ProductStatus
  label: string
  count: string
  isPending: boolean
  to: { query: Record<string, string | null | (string | null)[] | undefined> }
}

defineProps<{ views: ProductSavedView[]; activeStatus?: ProductStatus; hasError: boolean }>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useT()
</script>

<template>
  <div class="flex items-center gap-2">
    <nav
      class="flex min-w-0 flex-1 gap-1 overflow-x-auto border-b border-default"
      :aria-label="t('products.savedViews.label')"
    >
      <RouterLink
        v-for="view in views"
        :key="view.status ?? 'all'"
        :to="view.to"
        class="-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :class="
          activeStatus === view.status ? 'border-primary font-medium text-highlighted' : 'border-transparent text-muted'
        "
        :aria-current="activeStatus === view.status ? 'page' : undefined"
      >
        {{ view.label }}
        <USkeleton v-if="view.isPending" class="h-5 w-8 rounded-full" />
        <UBadge v-else color="neutral" variant="soft" size="sm" class="tabular-nums">{{ view.count }}</UBadge>
      </RouterLink>
    </nav>
    <UButton v-if="hasError" color="neutral" variant="soft" size="sm" @click="emit('retry')">
      {{ t('common.retry') }}
    </UButton>
  </div>
</template>
