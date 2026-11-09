<script setup lang="ts">
// PROTOTYPE A — "Action-first": hàng đợi cần xử lý lên đầu, 1 KPI hero + chart, danh sách bên dưới.
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'

import {
  compactVnd,
  kpis,
  lowStock,
  queues,
  recentOrders,
  revenuePoints,
  statusLabel,
  statusTone,
  vnd,
} from '@features/dashboard/prototype/DashboardFixture'
import MiniBars from '@features/dashboard/prototype/MiniBars.vue'

const secondary = [
  { label: 'Đơn hàng', value: kpis.orders.value.toLocaleString('vi-VN'), delta: kpis.orders.delta },
  { label: 'Khách hàng', value: kpis.customers.value.toLocaleString('vi-VN'), delta: kpis.customers.delta },
  { label: 'Giá trị TB/đơn', value: vnd(kpis.aov.value), delta: kpis.aov.delta },
]
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-sm text-muted">Thứ Hai, 9/11/2026</p>
        <h1 class="font-display text-2xl font-semibold text-highlighted">Chào buổi sáng, Mock Admin</h1>
      </div>
      <UButton color="neutral" variant="outline" icon="i-lucide-calendar">7 ngày qua</UButton>
    </header>

    <section aria-labelledby="queue-title">
      <h2 id="queue-title" class="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Cần xử lý</h2>
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RouterLink
          v-for="queue in queues"
          :key="queue.key"
          :to="queue.to"
          class="group flex items-center justify-between rounded-lg border border-default bg-default px-4 py-3 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          <span class="text-sm">{{ queue.label }}</span>
          <span class="flex items-center gap-2">
            <UBadge :color="queue.tone" variant="solid" size="lg" class="tabular-nums">{{ queue.count }}</UBadge>
            <span class="text-muted group-hover:text-primary" aria-hidden="true">›</span>
          </span>
        </RouterLink>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-3">
      <div class="rounded-xl border border-default bg-default p-5 lg:col-span-2">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="text-sm text-muted">Doanh thu 7 ngày</h2>
          <span class="text-sm font-medium text-success">▲ {{ kpis.revenue.delta }}%</span>
        </div>
        <p class="mt-1 font-display text-4xl font-bold tabular-nums">{{ compactVnd(kpis.revenue.value) }}</p>
        <MiniBars class="mt-6" :points="revenuePoints" :height="180" />
      </div>
      <div class="grid gap-4">
        <div v-for="item in secondary" :key="item.label" class="rounded-xl border border-default bg-default p-4">
          <p class="text-sm text-muted">{{ item.label }}</p>
          <div class="mt-1 flex items-baseline justify-between gap-2">
            <p class="font-display text-2xl font-semibold tabular-nums">{{ item.value }}</p>
            <span class="text-sm" :class="item.delta >= 0 ? 'text-success' : 'text-error'">
              {{ item.delta >= 0 ? '▲' : '▼' }} {{ Math.abs(item.delta) }}%
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-3">
      <div class="overflow-hidden rounded-xl border border-default bg-default lg:col-span-2">
        <div class="flex items-center justify-between px-5 py-3">
          <h2 class="font-semibold">Đơn hàng gần đây</h2>
          <UButton to="/orders" variant="link" size="sm">Xem tất cả</UButton>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-elevated text-left text-xs text-muted">
              <tr>
                <th class="px-5 py-2 font-medium">Mã</th>
                <th class="px-5 py-2 font-medium">Khách hàng</th>
                <th class="px-5 py-2 font-medium">Trạng thái</th>
                <th class="px-5 py-2 text-right font-medium">Tổng</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default">
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="px-5 py-2.5 font-mono">
                  <RouterLink :to="`/orders/${order.id}`" class="hover:text-primary">{{ order.number }}</RouterLink>
                </td>
                <td class="max-w-48 truncate px-5 py-2.5">{{ order.customer }}</td>
                <td class="px-5 py-2.5">
                  <UBadge :color="statusTone[order.status]" variant="subtle">{{ statusLabel[order.status] }}</UBadge>
                </td>
                <td class="px-5 py-2.5 text-right tabular-nums">{{ vnd(order.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="rounded-xl border border-default bg-default p-5">
        <h2 class="font-semibold">Sắp hết hàng</h2>
        <ul class="mt-3 divide-y divide-default text-sm">
          <li v-for="item in lowStock" :key="item.id" class="flex items-center justify-between gap-3 py-2.5">
            <span class="truncate">{{ item.name }}</span>
            <UBadge :color="item.stock === 0 ? 'error' : 'warning'" variant="subtle" class="tabular-nums">
              {{ item.stock === 0 ? 'Hết' : `Còn ${item.stock}` }}
            </UBadge>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
