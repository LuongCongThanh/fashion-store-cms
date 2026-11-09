<script setup lang="ts">
// PROTOTYPE C — "Ops console": cột trái là hàng đợi công việc + bảng dày; cột phải sticky là KPI gọn.
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import { ref } from 'vue'

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

const activeQueue = ref<string>('pending')
const stats = [
  { label: 'Doanh thu 7N', value: compactVnd(kpis.revenue.value), delta: kpis.revenue.delta },
  { label: 'Đơn hàng', value: kpis.orders.value.toLocaleString('vi-VN'), delta: kpis.orders.delta },
  { label: 'Khách hàng', value: kpis.customers.value.toLocaleString('vi-VN'), delta: kpis.customers.delta },
  { label: 'TB/đơn', value: compactVnd(kpis.aov.value), delta: kpis.aov.delta },
]
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[1fr_20rem]">
    <section class="min-w-0 space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h1 class="font-display text-xl font-semibold text-highlighted">Việc hôm nay</h1>
        <UButton size="sm" to="/orders">Mở trang đơn hàng</UButton>
      </div>
      <div role="tablist" class="flex gap-1 overflow-x-auto border-b border-default">
        <button
          v-for="queue in queues"
          :key="queue.key"
          role="tab"
          :aria-selected="activeQueue === queue.key"
          class="-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm"
          :class="
            activeQueue === queue.key
              ? 'border-primary font-medium text-highlighted'
              : 'border-transparent text-muted hover:text-default'
          "
          @click="activeQueue = queue.key"
        >
          {{ queue.label }}
          <UBadge :color="queue.tone" variant="subtle" size="sm" class="tabular-nums">{{ queue.count }}</UBadge>
        </button>
      </div>
      <div class="overflow-x-auto rounded-lg border border-default">
        <table class="w-full text-sm">
          <thead class="bg-elevated text-left text-xs text-muted">
            <tr>
              <th class="w-10 px-3 py-2"><UCheckbox aria-label="Chọn tất cả" /></th>
              <th class="px-3 py-2 font-medium">Mã</th>
              <th class="px-3 py-2 font-medium">Khách hàng</th>
              <th class="px-3 py-2 font-medium">Trạng thái</th>
              <th class="px-3 py-2 text-right font-medium">Tổng</th>
              <th class="px-3 py-2"><span class="sr-only">Hành động</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-default">
            <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-elevated/50">
              <td class="px-3 py-1.5"><UCheckbox :aria-label="`Chọn ${order.number}`" /></td>
              <td class="px-3 py-1.5 font-mono">{{ order.number }}</td>
              <td class="max-w-56 truncate px-3 py-1.5">{{ order.customer }}</td>
              <td class="px-3 py-1.5">
                <UBadge :color="statusTone[order.status]" variant="subtle" size="sm">
                  {{ statusLabel[order.status] }}
                </UBadge>
              </td>
              <td class="px-3 py-1.5 text-right tabular-nums">{{ vnd(order.total) }}</td>
              <td class="px-3 py-1.5 text-right">
                <UButton size="xs" variant="soft" :to="`/orders/${order.id}`">Xử lý</UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <aside class="space-y-4 xl:sticky xl:top-4 xl:self-start">
      <div class="rounded-lg border border-default">
        <h2 class="border-b border-default px-4 py-2 text-xs font-semibold tracking-wider text-muted uppercase">
          Chỉ số 7 ngày
        </h2>
        <dl class="divide-y divide-default">
          <div v-for="stat in stats" :key="stat.label" class="flex items-baseline justify-between px-4 py-2">
            <dt class="text-sm text-muted">{{ stat.label }}</dt>
            <dd class="flex items-baseline gap-2">
              <span class="font-semibold tabular-nums">{{ stat.value }}</span>
              <span class="w-12 text-right text-xs" :class="stat.delta >= 0 ? 'text-success' : 'text-error'">
                {{ stat.delta >= 0 ? '+' : '−' }}{{ Math.abs(stat.delta) }}%
              </span>
            </dd>
          </div>
        </dl>
        <MiniBars class="px-4 pt-2 pb-3" :points="revenuePoints" :height="56" :showLabels="false" />
      </div>
      <div class="rounded-lg border border-default">
        <h2 class="border-b border-default px-4 py-2 text-xs font-semibold tracking-wider text-muted uppercase">
          Tồn kho thấp
        </h2>
        <ul class="divide-y divide-default text-sm">
          <li v-for="item in lowStock" :key="item.id" class="flex justify-between gap-3 px-4 py-2">
            <span class="truncate">{{ item.name }}</span>
            <span class="tabular-nums" :class="item.stock === 0 ? 'text-error' : 'text-warning'">{{ item.stock }}</span>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
