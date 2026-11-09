<script setup lang="ts">
import { useFormat } from '@shared/lib/format/Format'

import type { Order } from '@features/orders/types/Order.types'
defineProps<{ events: Order['timeline'] }>()
const format = useFormat()
</script>

<template>
  <ol class="space-y-2">
    <li v-for="event in events" :key="event.id">
      <time :datetime="event.createdAt">{{ format.dateTime(event.createdAt) }}</time> {{ event.label }}
    </li>
  </ol>
</template>
