<script setup lang="ts">
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { InventoryItem } from '@features/inventory/types/Inventory.types'
defineProps<{ status: InventoryItem['status'] }>()
const { t } = useT()
const colors = { 'in-stock': 'success', 'low-stock': 'warning', 'out-of-stock': 'error' } as const
</script>

<template>
  <StatusBadge :label="t(`inventory.status.${status}`)" :color="colors[status]" />
</template>
