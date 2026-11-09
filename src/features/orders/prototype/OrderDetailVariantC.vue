<script setup lang="ts">
// PROTOTYPE C — "Invoice document": đơn trình bày như hoá đơn giấy; lịch sử là rail dọc bên trái, action bar dính đáy.
import UButton from '@nuxt/ui/components/Button.vue'

import { order, vnd } from '@features/orders/prototype/OrderFixture'
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[14rem_1fr]">
    <aside class="order-2 lg:order-1" aria-label="Lịch sử đơn">
      <h2 class="text-xs font-semibold tracking-wider text-muted uppercase">Hoạt động</h2>
      <ol class="mt-3 space-y-4 text-sm">
        <li v-for="(event, index) in order.timeline" :key="event.id" class="flex gap-3">
          <span class="mt-1.5 size-2 shrink-0 rounded-full" :class="index === 0 ? 'bg-primary' : 'bg-accented'" />
          <div>
            <p :class="index === 0 ? 'font-medium' : 'text-muted'">{{ event.label }}</p>
            <p class="text-xs text-dimmed">{{ event.createdAt }}</p>
          </div>
        </li>
      </ol>
    </aside>

    <article class="order-1 mx-auto w-full max-w-3xl rounded-sm border border-default bg-default shadow-sm lg:order-2">
      <header class="flex flex-wrap items-start justify-between gap-4 border-b border-default p-8">
        <div>
          <p class="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Đơn hàng</p>
          <h1 class="mt-1 font-display text-3xl font-semibold text-highlighted">{{ order.number }}</h1>
          <p class="mt-1 text-sm text-muted">{{ order.createdAt }}</p>
        </div>
        <div class="text-right text-sm">
          <p class="font-semibold text-primary">Đang xử lý</p>
          <p class="text-success">Đã thanh toán</p>
        </div>
      </header>

      <div class="grid gap-6 border-b border-default p-8 text-sm sm:grid-cols-2">
        <div>
          <h2 class="mb-1 text-xs text-muted uppercase">Giao đến</h2>
          <p class="font-medium">{{ order.customer.name }}</p>
          <p>{{ order.shipping.address }}</p>
          <p class="break-all text-muted">{{ order.customer.email }}</p>
        </div>
        <div class="sm:text-right">
          <h2 class="mb-1 text-xs text-muted uppercase">Vận chuyển & thanh toán</h2>
          <p>{{ order.shipping.carrier }}</p>
          <p class="font-mono text-xs">{{ order.shipping.trackingNumber }}</p>
          <p class="mt-2">{{ order.payment.method }}</p>
          <p class="font-mono text-xs text-muted">{{ order.payment.reference }}</p>
        </div>
      </div>

      <div class="overflow-x-auto p-8">
        <table class="w-full min-w-[30rem] text-sm">
          <thead class="border-b border-default text-left text-xs text-muted uppercase">
            <tr>
              <th class="pb-2 font-medium">Mặt hàng</th>
              <th class="pb-2 text-right font-medium">SL</th>
              <th class="pb-2 text-right font-medium">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id" class="border-b border-dashed border-default">
              <td class="py-3 pr-4">
                {{ item.name }}<span class="block text-xs text-muted tabular-nums">{{ vnd(item.price) }} / sp</span>
              </td>
              <td class="py-3 text-right tabular-nums">{{ item.quantity }}</td>
              <td class="py-3 text-right tabular-nums">{{ vnd(item.price * item.quantity) }}</td>
            </tr>
          </tbody>
        </table>
        <dl class="mt-6 ml-auto w-full max-w-xs space-y-1 text-sm">
          <div class="flex justify-between">
            <dt class="text-muted">Tạm tính</dt>
            <dd class="tabular-nums">{{ vnd(order.subtotal ?? 0) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-muted">Giảm giá</dt>
            <dd class="tabular-nums">−{{ vnd(order.discount ?? 0) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-muted">Vận chuyển</dt>
            <dd class="tabular-nums">{{ vnd(order.shippingCost ?? 0) }}</dd>
          </div>
          <div class="flex justify-between border-t-2 border-default pt-2 font-display text-xl font-semibold">
            <dt>Tổng</dt>
            <dd class="tabular-nums">{{ vnd(order.total) }}</dd>
          </div>
        </dl>
      </div>

      <footer
        class="sticky bottom-16 flex flex-wrap justify-end gap-2 border-t border-default bg-default/95 p-4 backdrop-blur"
      >
        <UButton color="error" variant="ghost">Huỷ đơn</UButton>
        <UButton color="neutral" variant="outline">In</UButton>
        <UButton>Chuyển sang Đang giao</UButton>
      </footer>
    </article>
  </div>
</template>
