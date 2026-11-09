<script setup lang="ts">
// PROTOTYPE B — "Editorial report": không card; typography lớn, tóm tắt bằng câu, KPI ngăn bằng đường kẻ.
import {
  compactVnd,
  kpis,
  lowStock,
  queues,
  revenuePoints,
  topProducts,
  vnd,
} from '@features/dashboard/prototype/DashboardFixture'
import MiniBars from '@features/dashboard/prototype/MiniBars.vue'

const row = [
  { label: 'Doanh thu', value: compactVnd(kpis.revenue.value), delta: kpis.revenue.delta },
  { label: 'Đơn hàng', value: kpis.orders.value.toLocaleString('vi-VN'), delta: kpis.orders.delta },
  { label: 'Khách hàng', value: kpis.customers.value.toLocaleString('vi-VN'), delta: kpis.customers.delta },
  { label: 'Giá trị TB/đơn', value: compactVnd(kpis.aov.value), delta: kpis.aov.delta },
]
const pending = queues.find((queue) => queue.key === 'pending')?.count ?? 0
</script>

<template>
  <article class="mx-auto max-w-5xl space-y-12">
    <header class="border-b border-default pb-8">
      <p class="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Báo cáo tuần · 03–09/11/2026</p>
      <h1 class="mt-3 font-display text-4xl leading-tight font-semibold text-highlighted md:text-5xl">
        Doanh thu tăng {{ kpis.revenue.delta }}%, kéo bởi dòng blazer linen.
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-muted">
        Còn <strong class="text-highlighted">{{ pending }} đơn</strong> chờ xác nhận và
        <strong class="text-highlighted">{{ lowStock.length }} SKU</strong> cần nhập thêm trước cuối tuần.
      </p>
    </header>

    <dl class="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:divide-x md:divide-default">
      <div v-for="item in row" :key="item.label" class="md:px-6 md:first:pl-0">
        <dt class="text-sm text-muted">{{ item.label }}</dt>
        <dd class="mt-2 font-display text-3xl font-semibold tabular-nums">{{ item.value }}</dd>
        <dd class="mt-1 text-sm" :class="item.delta >= 0 ? 'text-success' : 'text-error'">
          {{ item.delta >= 0 ? '+' : '−' }}{{ Math.abs(item.delta) }}% so với tuần trước
        </dd>
      </div>
    </dl>

    <section>
      <h2 class="font-display text-xl font-semibold">Doanh thu theo ngày</h2>
      <MiniBars class="mt-6" :points="revenuePoints" :height="220" />
    </section>

    <section class="grid gap-12 md:grid-cols-2">
      <div>
        <h2 class="font-display text-xl font-semibold">Bán chạy nhất</h2>
        <ol class="mt-4 space-y-4">
          <li v-for="(product, index) in topProducts" :key="product.id" class="flex gap-4">
            <span class="font-display text-3xl font-semibold text-dimmed tabular-nums">0{{ index + 1 }}</span>
            <div class="min-w-0 flex-1 border-b border-default pb-4">
              <p class="font-medium">{{ product.name }}</p>
              <p class="text-sm text-muted tabular-nums">{{ product.sold }} sản phẩm · {{ vnd(product.revenue) }}</p>
            </div>
          </li>
        </ol>
      </div>
      <div>
        <h2 class="font-display text-xl font-semibold">Cần nhập hàng</h2>
        <ul class="mt-4 space-y-4">
          <li v-for="item in lowStock" :key="item.id" class="flex justify-between gap-4 border-b border-default pb-4">
            <span>{{ item.name }}</span>
            <span class="shrink-0 tabular-nums" :class="item.stock === 0 ? 'font-semibold text-error' : 'text-warning'">
              {{ item.stock === 0 ? 'Hết hàng' : `Còn ${item.stock}` }}
            </span>
          </li>
        </ul>
        <RouterLink to="/inventory" class="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          Mở kho hàng →
        </RouterLink>
      </div>
    </section>
  </article>
</template>
