<script setup lang="ts">
import type { Order } from '../types/Order.types'
defineProps<{ payment: Order['payment'] }>()
</script>
<template>
  <div class="space-y-2">
    <p>{{ payment.method }}</p>
    <p>{{ payment.reference }}</p>
  </div>
</template>
