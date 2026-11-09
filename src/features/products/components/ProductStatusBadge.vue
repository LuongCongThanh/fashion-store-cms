<script setup lang="ts">
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Product } from '@features/products/types/Product.types'
defineProps<{ status: Product['status'] }>()
const { t } = useT()
const colors = { draft: 'neutral', published: 'success', archived: 'warning' } as const
</script>

<template>
  <StatusBadge :color="colors[status]" :label="t(`products.status.${status}`)" />
</template>
