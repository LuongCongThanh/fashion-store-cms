<script setup lang="ts">
import type { Order } from '@features/orders/types/Order.types'
defineProps<{ payment: Order['payment'] }>()
</script>

<template>
  <div class="space-y-2">
    <p>{{ payment.method }}</p>
    <p class="font-mono break-all">{{ payment.reference }}</p>
  </div>
</template>
