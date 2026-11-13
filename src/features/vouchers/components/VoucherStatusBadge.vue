<script setup lang="ts">
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { VoucherStatus } from '@features/vouchers/types/Voucher.types'
defineProps<{ status: VoucherStatus }>()
const { t } = useT()
const colors = {
  ACTIVE: 'success',
  UPCOMING: 'info',
  ENDED: 'neutral',
  EXHAUSTED: 'warning',
  DISABLED: 'neutral',
} as const
</script>

<template>
  <StatusBadge :color="colors[status]" :label="t(`vouchers.status.${status}`)" />
</template>
