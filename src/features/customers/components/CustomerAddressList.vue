<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'

import type { Customer } from '@features/customers/types/Customer.types'
defineProps<{ addresses: Customer['addresses'] }>()
const { t } = useT()
</script>

<template>
  <ul v-if="addresses.length" class="space-y-4">
    <li v-for="address in addresses" :key="address.id">
      <strong>{{ address.label }}</strong>
      <p>{{ address.address }}</p>
      <span v-if="address.isDefault">{{ t('customers.default') }}</span>
    </li>
  </ul>
  <p v-else>{{ t('common.empty') }}</p>
</template>
