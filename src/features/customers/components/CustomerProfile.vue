<script setup lang="ts">
import type { Customer } from '@features/customers/types/Customer.types'
defineProps<{ customer: Customer }>()
</script>
<template>
  <dl class="space-y-3">
    <dt>{{ customer.name }}</dt>
    <dd>{{ customer.email }}</dd>
    <dd>{{ customer.phone }}</dd>
  </dl>
</template>
