<script setup lang="ts">
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { ProductStatus } from '@features/products/types/Product.types'
defineProps<{ status: ProductStatus }>()
const { t } = useT()
const colors = { DRAFT: 'neutral', ACTIVE: 'success', ARCHIVED: 'warning' } as const
</script>

<template>
  <StatusBadge :color="colors[status]" :label="t(`products.status.${status}`)" />
</template>
