<script setup lang="ts">
import type { Order } from '../types/Order.types'
defineProps<{ customer: Order['customer'] }>()
</script>
<template>
  <div class="space-y-2">
    <p>{{ customer.name }}</p>
    <p>{{ customer.email }}</p>
  </div>
</template>
