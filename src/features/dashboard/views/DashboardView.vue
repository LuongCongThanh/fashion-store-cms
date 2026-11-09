<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

import { useAuth } from '@features/auth/UseAuth'
import { useDashboardQuery } from '@features/dashboard/api/Dashboard.api'
import DashboardList from '@features/dashboard/components/DashboardList.vue'
import StatCard from '@features/dashboard/components/StatCard.vue'
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
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
  { key: 'pending-orders', title: 'dashboard.pendingOrders', kind: 'queue', permission: 'order:read', to: '/orders?status=pending' },
  { key: 'revenue', title: 'dashboard.revenue', kind: 'stat', permission: 'order:read', format: 'money' },
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
  {
    key: 'recent-orders',
    title: 'dashboard.recentOrders',
    kind: 'list',
    permission: 'order:read',
    format: 'money',
    link: (item) => `/orders/${encodeURIComponent(item.id)}`,
  },
  {
    key: 'top-products',
    title: 'dashboard.topProducts',
    kind: 'list',
    permission: 'product:read',
    link: (item) => `/products/${encodeURIComponent(item.id)}`,
  },
  {
    key: 'low-stock',
    title: 'dashboard.lowStock',
    kind: 'list',
    permission: 'inventory:read',
    link: (item) => `/inventory?search=${encodeURIComponent(item.label)}`,
  },
]
const widgets = computed(() => definitions.filter((widget) => can(widget.permission)))
const results = useDashboardQuery(widgets)
const resolved = computed(() => widgets.value.map((widget, index) => ({ ...widget, result: results.value[index] })))
const queues = computed(() => resolved.value.filter((widget) => widget.kind === 'queue'))
const cards = computed(() => resolved.value.filter((widget) => widget.kind !== 'queue'))
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('nav.dashboard')" :description="t('dashboard.summary')" />
    <LoadingState v-if="loadingUser" />
    <EmptyState v-else-if="!cards.length" :title="t('common.empty')" />
    <section v-if="queues.length" aria-labelledby="dashboard-queue-title">
      <h2 id="dashboard-queue-title" class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{{ t('dashboard.needsAttention') }}</h2>
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RouterLink v-for="queue in queues" :key="queue.key" :to="queue.to!" class="flex items-center justify-between rounded-lg border border-default bg-default px-4 py-3 transition-colors duration-150 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
          <span class="text-sm">{{ t(queue.title as MessageKey) }}</span>
          <span class="tabular-nums">{{ queue.result?.isPending ? '…' : (queue.result?.data?.value ?? 0) }} <span aria-hidden="true">›</span></span>
        </RouterLink>
      </div>
    </section>
    <div class="grid gap-4 lg:grid-cols-3">
      <section
        v-for="card in cards"
        :key="card.key"
        :data-widget="card.key"
        class="space-y-3 rounded-lg border border-default bg-default p-5"
        :class="card.key === 'revenue-chart' ? 'lg:col-span-2' : ''"
      >
        <h2 class="font-semibold">{{ t(card.title as MessageKey) }}</h2>
        <LoadingState v-if="card.result?.isPending" />
        <ErrorState v-else-if="card.result?.isError" :error="card.result.error" @retry="card.result.refetch()" />
        <StatCard
          v-else-if="card.kind === 'stat' && card.result?.data?.value !== undefined"
          :value="card.result.data.value"
          :format="card.format ?? 'number'"
        />
        <component
          :is="card.key === 'revenue-chart' ? RevenueChart : OrderChart"
          v-else-if="card.kind === 'chart' && card.result?.data?.points?.length"
          :points="card.result.data.points"
          :title="t(card.title as MessageKey)"
        />
        <DashboardList
          v-else-if="card.link && card.result?.data?.items?.length"
          :items="card.result.data.items"
          :format="card.format ?? 'number'"
          :linkTo="card.link"
          :soldOutLabel="card.key === 'low-stock' ? t('dashboard.soldOut') : undefined"
        />
        <EmptyState v-else :title="t('common.empty')" />
      </section>
    </div>
  </div>
</template>
