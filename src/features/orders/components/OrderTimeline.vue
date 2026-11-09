<script setup lang="ts">
import type { Order } from '@features/orders/types/Order.types'
defineProps<{ events: Order['timeline'] }>()
</script>

<template>
  <ol class="space-y-2">
    <li v-for="event in events" :key="event.id">
      <time>{{ event.createdAt }}</time> {{ event.label }}
    </li>
  </ol>
</template>
