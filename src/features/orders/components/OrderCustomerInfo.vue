<script setup lang="ts">
import type { Order } from '@features/orders/types/Order.types'
defineProps<{ customer: Order['customer'] }>()
</script>

<template>
  <div class="space-y-2">
    <p>{{ customer.name }}</p>
    <p class="break-all">{{ customer.email }}</p>
  </div>
</template>
