<script setup lang="ts">
// PROTOTYPE A — "Two-column": cột chính là sản phẩm + tổng tiền; sidebar sticky là trạng thái, khách, giao hàng, lịch sử.
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'

import { order, vnd } from '@features/orders/prototype/OrderFixture'
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <RouterLink to="/orders" class="text-sm text-muted hover:text-default">← Đơn hàng</RouterLink>
        <div class="mt-1 flex flex-wrap items-center gap-3">
          <h1 class="font-display text-2xl font-semibold text-highlighted">{{ order.number }}</h1>
          <UBadge color="primary" variant="subtle">Đang xử lý</UBadge>
          <UBadge color="success" variant="subtle">Đã thanh toán</UBadge>
        </div>
        <p class="mt-1 text-sm text-muted">Đặt lúc {{ order.createdAt }}</p>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="outline">In hoá đơn</UButton>
        <UButton color="error" variant="ghost">Huỷ đơn</UButton>
        <UButton>Chuyển sang Đang giao</UButton>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <section class="min-w-0 rounded-xl border border-default bg-default">
        <h2 class="border-b border-default px-5 py-3 font-semibold">Sản phẩm ({{ order.items.length }})</h2>
        <ul class="divide-y divide-default">
          <li v-for="item in order.items" :key="item.id" class="flex gap-4 px-5 py-3">
            <div class="size-12 shrink-0 rounded bg-elevated" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <p class="font-medium">{{ item.name }}</p>
              <p class="font-mono text-xs text-muted">{{ item.sku }}</p>
            </div>
            <div class="text-right text-sm tabular-nums">
              <p>{{ vnd(item.price) }} × {{ item.quantity }}</p>
              <p class="font-semibold">{{ vnd(item.price * item.quantity) }}</p>
            </div>
          </li>
        </ul>
        <dl class="space-y-1.5 border-t border-default px-5 py-4 text-sm">
          <div class="flex justify-between">
            <dt class="text-muted">Tạm tính</dt>
            <dd class="tabular-nums">{{ vnd(order.subtotal ?? 0) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-muted">Giảm giá (AUTUMN10)</dt>
            <dd class="text-success tabular-nums">−{{ vnd(order.discount ?? 0) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-muted">Phí vận chuyển</dt>
            <dd class="tabular-nums">{{ vnd(order.shippingCost ?? 0) }}</dd>
          </div>
          <div class="flex justify-between border-t border-default pt-2 text-base font-semibold">
            <dt>Tổng cộng</dt>
            <dd class="tabular-nums">{{ vnd(order.total) }}</dd>
          </div>
        </dl>
      </section>

      <aside class="space-y-4 lg:sticky lg:top-4 lg:self-start">
        <section class="rounded-xl border border-default bg-default p-4 text-sm">
          <h2 class="mb-2 font-semibold">Khách hàng</h2>
          <RouterLink :to="`/customers/${order.customer.id}`" class="font-medium text-primary hover:underline">
            {{ order.customer.name }}
          </RouterLink>
          <p class="break-all text-muted">{{ order.customer.email }}</p>
        </section>
        <section class="rounded-xl border border-default bg-default p-4 text-sm">
          <h2 class="mb-2 font-semibold">Giao hàng</h2>
          <p>{{ order.shipping.address }}</p>
          <p class="mt-2 text-muted">
            {{ order.shipping.carrier }} · <span class="font-mono">{{ order.shipping.trackingNumber }}</span>
          </p>
        </section>
        <section class="rounded-xl border border-default bg-default p-4 text-sm">
          <h2 class="mb-2 font-semibold">Thanh toán</h2>
          <p>{{ order.payment.method }}</p>
          <p class="font-mono text-xs text-muted">{{ order.payment.reference }}</p>
        </section>
        <section class="rounded-xl border border-default bg-default p-4 text-sm">
          <h2 class="mb-3 font-semibold">Lịch sử</h2>
          <ol class="space-y-3 border-l border-default pl-4">
            <li v-for="(event, index) in order.timeline" :key="event.id" class="relative">
              <span
                class="absolute top-1.5 -left-[1.3rem] size-2 rounded-full"
                :class="index === 0 ? 'bg-primary' : 'bg-accented'"
                aria-hidden="true"
              />
              <p>{{ event.label }}</p>
              <p class="text-xs text-muted">{{ event.createdAt }}</p>
            </li>
          </ol>
        </section>
      </aside>
    </div>
  </div>
</template>
