<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

import { useAuth } from '@features/auth/UseAuth'
import { useDashboardQuery } from '@features/dashboard/api/Dashboard.api'
import LowStockList from '@features/dashboard/components/LowStockList.vue'
import RecentOrders from '@features/dashboard/components/RecentOrders.vue'
import StatCard from '@features/dashboard/components/StatCard.vue'
import TopProducts from '@features/dashboard/components/TopProducts.vue'
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useNotify } from '@shared/composables/UseNotify'
import { useT } from '@shared/lib/i18n/I18n'

import type { DashboardWidget } from '@features/dashboard/types/Dashboard.types'
import type { MessageKey } from '@shared/lib/i18n/I18n'
const { t } = useT()
const { can, ensureUser } = useAuth()
const notify = useNotify()
const loadingUser = ref(true)
onMounted(async () => {
  try {
    await ensureUser()
  } catch (error) {
    notify.error(error)
  } finally {
    loadingUser.value = false
  }
})
const RevenueChart = defineAsyncComponent(() => import('@features/dashboard/components/RevenueChart.vue'))
const OrderChart = defineAsyncComponent(() => import('@features/dashboard/components/OrderChart.vue'))
const definitions: DashboardWidget[] = [
  { key: 'revenue', title: 'dashboard.revenue', kind: 'stat', permission: 'order:read' },
  { key: 'orders', title: 'nav.orders', kind: 'stat', permission: 'order:read' },
  { key: 'customers', title: 'dashboard.customers', kind: 'stat', permission: 'customer:read' },
  { key: 'products', title: 'dashboard.products', kind: 'stat', permission: 'product:read' },
  {
    key: 'revenue-chart',
    title: 'dashboard.revenueChart',
    kind: 'chart',
    permission: 'order:read',
  },
  { key: 'order-chart', title: 'dashboard.orderChart', kind: 'chart', permission: 'order:read' },
  { key: 'recent-orders', title: 'dashboard.recentOrders', kind: 'list', permission: 'order:read' },
  { key: 'top-products', title: 'dashboard.topProducts', kind: 'list', permission: 'product:read' },
  { key: 'low-stock', title: 'dashboard.lowStock', kind: 'list', permission: 'inventory:read' },
]
const widgets = computed(() => definitions.filter((widget) => can(widget.permission)))
const results = useDashboardQuery(widgets)
const cards = computed(() => widgets.value.map((widget, index) => ({ ...widget, result: results.value[index] })))
const lists = {
  'recent-orders': RecentOrders,
  'top-products': TopProducts,
  'low-stock': LowStockList,
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('nav.dashboard')" />
    <p v-if="loadingUser" role="status">{{ t('common.loading') }}</p>
    <EmptyState v-else-if="!cards.length" :title="t('common.empty')" />
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <section
        v-for="card in cards"
        :key="card.key"
        :data-widget="card.key"
        class="space-y-3 rounded-xl border border-default bg-default p-5"
      >
        <h2 class="font-semibold">{{ t(card.title as MessageKey) }}</h2>
        <p v-if="card.result?.isPending" role="status">{{ t('common.loading') }}</p>
        <ErrorState v-else-if="card.result?.isError" :error="card.result.error" @retry="card.result.refetch()" />
        <StatCard
          v-else-if="card.kind === 'stat' && card.result?.data?.value !== undefined"
          :value="card.result.data.value"
        />
        <component
          :is="card.key === 'revenue-chart' ? RevenueChart : OrderChart"
          v-else-if="card.kind === 'chart' && card.result?.data?.points?.length"
          :points="card.result.data.points"
          :title="t(card.title as MessageKey)"
        />
        <component
          :is="lists[card.key as keyof typeof lists]"
          v-else-if="card.result?.data?.items?.length"
          :items="card.result.data.items"
        />
        <EmptyState v-else :title="t('common.empty')" />
      </section>
    </div>
  </div>
</template>
