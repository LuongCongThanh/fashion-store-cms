<script setup lang="ts">
import type { Order } from '@features/orders/types/Order.types'
defineProps<{ shipping: Order['shipping'] }>()
</script>
<template>
  <div class="space-y-2">
    <p>{{ shipping.address }}</p>
    <p>{{ shipping.carrier }}</p>
    <p>{{ shipping.trackingNumber }}</p>
  </div>
</template>
