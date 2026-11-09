<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'

import type { OrderStatus } from '@features/orders/types/Order.types'

const props = defineProps<{ status: OrderStatus }>()
const { t } = useT()
const steps: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
const current = () => steps.indexOf(props.status)
</script>

<template>
  <ol v-if="current() >= 0" class="grid grid-cols-5 gap-2" :aria-label="t('common.status')">
    <li v-for="(step, index) in steps" :key="step" :aria-current="step === status ? 'step' : undefined" class="min-w-0">
      <div class="h-1.5 rounded-full" :class="index <= current() ? 'bg-primary' : 'bg-accented'" aria-hidden="true" />
      <span
        class="mt-2 block truncate text-xs"
        :class="step === status ? 'font-semibold text-highlighted' : 'text-muted'"
      >
        {{ t(`orders.status.${step}`) }}
      </span>
    </li>
  </ol>
</template>
