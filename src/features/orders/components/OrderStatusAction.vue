<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { nextOrderStatuses } from '@features/orders/schemas/OrderStatus'
import { useT } from '@shared/lib/i18n/I18n'

import type { OrderStatus } from '@features/orders/types/Order.types'
defineProps<{ status: OrderStatus; pending: boolean }>()
const emit = defineEmits<{ change: [status: OrderStatus] }>()
const { t } = useT()
</script>
<template>
  <div class="flex flex-wrap gap-2">
    <UButton
      v-for="next in nextOrderStatuses(status)"
      :key="next"
      :data-status="next"
      :color="next === 'cancelled' ? 'error' : 'primary'"
      :disabled="pending"
      @click="emit('change', next)"
      >{{ t(`orders.status.${next}`) }}</UButton
    >
  </div>
</template>
