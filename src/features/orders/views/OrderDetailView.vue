<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'

import { useOrderQuery, useOrderStatusMutation } from '../api/Orders.api'
import OrderCustomerInfo from '../components/OrderCustomerInfo.vue'
import OrderItems from '../components/OrderItems.vue'
import OrderPaymentInfo from '../components/OrderPaymentInfo.vue'
import OrderShippingInfo from '../components/OrderShippingInfo.vue'
import OrderStatusAction from '../components/OrderStatusAction.vue'
import OrderStatusBadge from '../components/OrderStatusBadge.vue'
import OrderSummary from '../components/OrderSummary.vue'
import OrderTimeline from '../components/OrderTimeline.vue'
import PaymentStatusBadge from '../components/PaymentStatusBadge.vue'
import { nextOrderStatuses } from '../schemas/OrderStatus'

import type { OrderStatus } from '../types/Order.types'
const route = useRoute()
const { can } = useAuth()
const { t } = useT()
const confirm = useConfirm()
const query = useOrderQuery(() => String(route.params.id))
const mutation = useOrderStatusMutation(() => String(route.params.id))
async function change(status: OrderStatus) {
  if (
    !can('order:write') ||
    !query.data.value ||
    !nextOrderStatuses(query.data.value.status).includes(status)
  )
    return
  if (
    status === 'cancelled' &&
    !(await confirm({ title: t('orders.cancelConfirm'), color: 'error' }))
  )
    return
  mutation.mutate(status)
}
</script>
<template>
  <LoadingState v-if="query.isPending.value" />
  <ErrorState v-else-if="query.isError.value" :error="query.error.value" @retry="query.refetch()" />
  <div v-else-if="query.data.value" class="space-y-5">
    <PageHeader :title="query.data.value.number" />
    <div class="flex gap-3">
      <OrderStatusBadge :status="query.data.value.status" />
      <PaymentStatusBadge :status="query.data.value.paymentStatus" />
    </div>
    <OrderStatusAction
      v-if="can('order:write')"
      :status="query.data.value.status"
      :pending="mutation.isPending.value"
      @change="change"
    />
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
