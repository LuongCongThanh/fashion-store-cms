<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useOrderQuery, useOrderStatusMutation } from '@features/orders/api/Orders.api'
import OrderCustomerInfo from '@features/orders/components/OrderCustomerInfo.vue'
import OrderItems from '@features/orders/components/OrderItems.vue'
import OrderPaymentInfo from '@features/orders/components/OrderPaymentInfo.vue'
import OrderProgress from '@features/orders/components/OrderProgress.vue'
import OrderShippingInfo from '@features/orders/components/OrderShippingInfo.vue'
import OrderStatusAction from '@features/orders/components/OrderStatusAction.vue'
import OrderStatusBadge from '@features/orders/components/OrderStatusBadge.vue'
import OrderSummary from '@features/orders/components/OrderSummary.vue'
import OrderTimeline from '@features/orders/components/OrderTimeline.vue'
import PaymentStatusBadge from '@features/orders/components/PaymentStatusBadge.vue'
import { nextOrderStatuses } from '@features/orders/schemas/OrderStatus'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { OrderStatus } from '@features/orders/types/Order.types'
const route = useRoute()
const { can } = useAuth()
const { t } = useT()
const confirm = useConfirm()
const query = useOrderQuery(() => String(route.params.id))
const mutation = useOrderStatusMutation(() => String(route.params.id))
async function change(status: OrderStatus) {
  if (!can('order:write') || !query.data.value || !nextOrderStatuses(query.data.value.status).includes(status)) return
  if (status === 'cancelled' && !(await confirm({ title: t('orders.cancelConfirm'), color: 'error' }))) return
  mutation.mutate(status)
}
</script>

<template>
  <LoadingState v-if="query.isPending.value" />
  <ErrorState v-else-if="query.isError.value" :error="query.error.value" @retry="query.refetch()" />
  <div v-else-if="query.data.value" class="space-y-6">
    <PageHeader :title="query.data.value.number">
      <template #description>
        <div class="mt-2 flex gap-2">
          <OrderStatusBadge :status="query.data.value.status" />
          <PaymentStatusBadge :status="query.data.value.paymentStatus" />
        </div>
      </template>
      <template #actions>
        <OrderStatusAction
          v-if="can('order:write')"
          :status="query.data.value.status"
          :pending="mutation.isPending.value"
          @change="change"
        />
      </template>
    </PageHeader>
    <OrderProgress :status="query.data.value.status" />
    <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div class="min-w-0 space-y-6">
        <FormSection :title="t('dashboard.products')">
          <OrderItems :items="query.data.value.items" />
        </FormSection>
        <FormSection :title="t('orders.total')">
          <OrderSummary :order="query.data.value" />
        </FormSection>
      </div>
      <aside class="space-y-4 lg:sticky lg:top-4">
        <FormSection :title="t('dashboard.customers')"
          ><OrderCustomerInfo :customer="query.data.value.customer"
        /></FormSection>
        <FormSection :title="t('orders.shipping')"
          ><OrderShippingInfo :shipping="query.data.value.shipping"
        /></FormSection>
        <FormSection :title="t('orders.payment')"><OrderPaymentInfo :payment="query.data.value.payment" /></FormSection>
        <FormSection :title="t('orders.timeline')"><OrderTimeline :events="query.data.value.timeline" /></FormSection>
      </aside>
    </div>
  </div>
</template>
