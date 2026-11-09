<script setup lang="ts">
import FilterBar from '@shared/components/list/FilterBar.vue'
import FilterDateRange from '@shared/components/list/FilterDateRange.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { OrderListParams } from '@features/orders/schemas/OrderList.schema'
defineProps<{ params: OrderListParams }>()
const emit = defineEmits<{ filter: [key: string, value: unknown] }>()
const { t } = useT()
</script>
<template>
  <FilterBar>
    <ListSearch :modelValue="params.search" @update:modelValue="emit('filter', 'search', $event)" />
    <FilterDateRange :from="params.from" :to="params.to" @filter="(key, value) => emit('filter', key, value)" />
    <label
      >{{ t('common.status')
      }}<select
        name="status"
        :value="params.status ?? ''"
        @change="emit('filter', 'status', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">{{ t('common.all') }}</option>
        <option
          v-for="status in [
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'refunded',
          ] as const"
          :key="status"
          :value="status"
        >
          {{ t(`orders.status.${status}`) }}
        </option>
      </select>
    </label>
    <label
      >{{ t('orders.payment')
      }}<select
        name="paymentStatus"
        :value="params.paymentStatus ?? ''"
        @change="emit('filter', 'paymentStatus', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">{{ t('common.all') }}</option>
        <option v-for="status in ['paid', 'unpaid', 'refunded'] as const" :key="status" :value="status">
          {{ t(`orders.paymentStatus.${status}`) }}
        </option>
      </select>
    </label>
    <label v-for="key in ['customerId', 'minAmount', 'maxAmount'] as const" :key="key"
      >{{ t(`orders.${key}`)
      }}<input
        :name="key"
        :type="key === 'customerId' ? 'text' : 'number'"
        min="0"
        :value="params[key]"
        @change="emit('filter', key, ($event.target as HTMLInputElement).value)"
      />
    </label>
  </FilterBar>
</template>
