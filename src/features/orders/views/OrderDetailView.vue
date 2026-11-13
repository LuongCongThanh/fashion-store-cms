<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useOrderQuery } from '@features/orders/api/Orders.api'
import OrderCustomerInfo from '@features/orders/components/OrderCustomerInfo.vue'
import OrderItems from '@features/orders/components/OrderItems.vue'
import OrderPaymentInfo from '@features/orders/components/OrderPaymentInfo.vue'
import OrderShippingInfo from '@features/orders/components/OrderShippingInfo.vue'
import OrderStatusBadge from '@features/orders/components/OrderStatusBadge.vue'
import OrderSummary from '@features/orders/components/OrderSummary.vue'
import OrderTimeline from '@features/orders/components/OrderTimeline.vue'
import PaymentStatusBadge from '@features/orders/components/PaymentStatusBadge.vue'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'

const route = useRoute()
const { t } = useT()
const query = useOrderQuery(() => String(route.params.id))
</script>

<template>
  <LoadingState v-if="query.isPending.value" />
  <ErrorState v-else-if="query.isError.value" :error="query.error.value" @retry="query.refetch()" />
  <div v-else-if="query.data.value" class="space-y-6">
    <PageHeader :title="query.data.value.number" />
    <div class="flex gap-3">
      <OrderStatusBadge :status="query.data.value.status" />
      <PaymentStatusBadge :status="query.data.value.paymentStatus" />
    </div>
    <!-- Hành động trên đơn do API trả (allowedActions), nối ở Tier 1 (plan CMS C8). -->
    <div class="grid gap-4 md:grid-cols-3">
      <FormSection :title="t('dashboard.customers')">
        <OrderCustomerInfo :customer="query.data.value.customer" />
      </FormSection>
      <FormSection :title="t('orders.shipping')">
        <OrderShippingInfo :shipping="query.data.value.shipping" />
      </FormSection>
      <FormSection :title="t('orders.payment')">
        <OrderPaymentInfo :payment="query.data.value.payment" />
      </FormSection>
    </div>
    <FormSection :title="t('dashboard.products')">
      <OrderItems :items="query.data.value.items" />
    </FormSection>
    <FormSection :title="t('orders.total')">
      <OrderSummary :order="query.data.value" />
    </FormSection>
    <FormSection :title="t('orders.timeline')">
      <OrderTimeline :events="query.data.value.timeline" />
    </FormSection>
  </div>
</template>
