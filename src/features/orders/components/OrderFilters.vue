<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import { computed } from 'vue'

import { ORDER_STATUSES } from '@features/orders/types/Order.types'
import FilterBar from '@shared/components/list/FilterBar.vue'
import FilterDateRange from '@shared/components/list/FilterDateRange.vue'
import FilterSelect from '@shared/components/list/FilterSelect.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { OrderListParams } from '@features/orders/schemas/OrderList.schema'
defineProps<{ params: OrderListParams }>()
const emit = defineEmits<{ filter: [key: string, value: unknown] }>()
const { t } = useT()

const PAYMENT_STATUSES = ['paid', 'unpaid', 'refunded'] as const
const statusItems = computed(() => ORDER_STATUSES.map((value) => ({ label: t(`orders.status.${value}`), value })))
const paymentItems = computed(() =>
  PAYMENT_STATUSES.map((value) => ({ label: t(`orders.paymentStatus.${value}`), value })),
)
</script>

<template>
  <FilterBar>
    <ListSearch :modelValue="params.search" @update:modelValue="emit('filter', 'search', $event)" />
    <FilterDateRange :from="params.from" :to="params.to" @filter="(key, value) => emit('filter', key, value)" />
    <FilterSelect
      name="status"
      :label="t('common.status')"
      :modelValue="params.status"
      :items="statusItems"
      @update:modelValue="emit('filter', 'status', $event)"
    />
    <FilterSelect
      name="paymentStatus"
      :label="t('orders.payment')"
      :modelValue="params.paymentStatus"
      :items="paymentItems"
      @update:modelValue="emit('filter', 'paymentStatus', $event)"
    />
    <UFormField
      v-for="key in ['customerId', 'minAmount', 'maxAmount'] as const"
      :key="key"
      :label="t(`orders.${key}`)"
      :name="key"
      size="sm"
    >
      <UInput
        :name="key"
        :type="key === 'customerId' ? 'text' : 'number'"
        min="0"
        :modelValue="params[key]"
        class="w-32"
        @change="emit('filter', key, ($event.target as HTMLInputElement).value)"
      />
    </UFormField>
  </FilterBar>
</template>
