<script setup lang="ts">
// PROTOTYPE B — "Lifecycle stepper": tiến trình đơn là hero, 1 hành động tiếp theo nổi bật, nội dung chia tab.
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import { ref } from 'vue'

import { lifecycle, order, vnd } from '@features/orders/prototype/OrderFixture'

const current = lifecycle.findIndex((step) => step.key === order.status)
const tabs = ['Sản phẩm', 'Khách & giao hàng', 'Lịch sử'] as const
const tab = ref<(typeof tabs)[number]>('Sản phẩm')
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-xl border border-default bg-default p-5">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-display text-2xl font-semibold text-highlighted">
            {{ order.number }} <span class="text-base font-normal text-muted">· {{ order.customer.name }}</span>
          </h1>
          <p class="text-sm text-muted">
            {{ order.createdAt }} ·
            <span class="font-semibold text-default tabular-nums">{{ vnd(order.total) }}</span> ·
            <UBadge color="success" variant="subtle" size="sm">Đã thanh toán</UBadge>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UButton color="neutral" variant="ghost" aria-label="Thêm thao tác">⋯</UButton>
          <UButton size="lg">Bàn giao vận chuyển →</UButton>
        </div>
      </div>

      <ol class="mt-6 grid grid-cols-5 gap-2" aria-label="Tiến trình đơn hàng">
        <li v-for="(step, index) in lifecycle" :key="step.key" :aria-current="index === current ? 'step' : undefined">
          <div class="h-1.5 rounded-full" :class="index <= current ? 'bg-primary' : 'bg-accented'" />
          <p
            class="mt-2 text-xs sm:text-sm"
            :class="
              index === current ? 'font-semibold text-highlighted' : index < current ? 'text-default' : 'text-muted'
            "
          >
            {{ index < current ? '✓ ' : '' }}{{ step.label }}
          </p>
        </li>
      </ol>
    </section>

    <div>
      <div role="tablist" class="flex gap-1 border-b border-default">
        <button
          v-for="item in tabs"
          :key="item"
          role="tab"
          :aria-selected="tab === item"
          class="-mb-px border-b-2 px-3 py-2 text-sm"
          :class="tab === item ? 'border-primary font-medium text-highlighted' : 'border-transparent text-muted'"
          @click="tab = item"
        >
          {{ item }}
        </button>
      </div>

      <div v-if="tab === 'Sản phẩm'" role="tabpanel" class="overflow-x-auto pt-4">
        <table class="w-full min-w-[36rem] text-sm">
          <thead class="text-left text-xs text-muted">
            <tr>
              <th class="pb-2 font-medium">Sản phẩm</th>
              <th class="pb-2 text-right font-medium">Đơn giá</th>
              <th class="pb-2 text-right font-medium">SL</th>
              <th class="pb-2 text-right font-medium">Thành tiền</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-default">
            <tr v-for="item in order.items" :key="item.id">
              <td class="py-2.5 pr-4">
                {{ item.name }} <span class="block font-mono text-xs text-muted">{{ item.sku }}</span>
              </td>
              <td class="py-2.5 text-right tabular-nums">{{ vnd(item.price) }}</td>
              <td class="py-2.5 text-right tabular-nums">{{ item.quantity }}</td>
              <td class="py-2.5 text-right tabular-nums">{{ vnd(item.price * item.quantity) }}</td>
            </tr>
          </tbody>
          <tfoot class="text-sm">
            <tr>
              <td colspan="3" class="pt-3 text-right text-muted">Tạm tính</td>
              <td class="pt-3 text-right tabular-nums">{{ vnd(order.subtotal ?? 0) }}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-right text-muted">Giảm giá</td>
              <td class="text-right text-success tabular-nums">−{{ vnd(order.discount ?? 0) }}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-right text-muted">Vận chuyển</td>
              <td class="text-right tabular-nums">{{ vnd(order.shippingCost ?? 0) }}</td>
            </tr>
            <tr class="text-base font-semibold">
              <td colspan="3" class="pt-2 text-right">Tổng</td>
              <td class="pt-2 text-right tabular-nums">{{ vnd(order.total) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div v-else-if="tab === 'Khách & giao hàng'" role="tabpanel" class="grid gap-6 pt-4 text-sm md:grid-cols-3">
        <div>
          <h3 class="mb-1 text-xs font-semibold text-muted uppercase">Khách hàng</h3>
          <p class="font-medium">{{ order.customer.name }}</p>
          <p class="break-all text-muted">{{ order.customer.email }}</p>
        </div>
        <div>
          <h3 class="mb-1 text-xs font-semibold text-muted uppercase">Địa chỉ giao</h3>
          <p>{{ order.shipping.address }}</p>
          <p class="mt-1 text-muted">{{ order.shipping.carrier }} · {{ order.shipping.trackingNumber }}</p>
        </div>
        <div>
          <h3 class="mb-1 text-xs font-semibold text-muted uppercase">Thanh toán</h3>
          <p>{{ order.payment.method }}</p>
          <p class="font-mono text-xs text-muted">{{ order.payment.reference }}</p>
        </div>
      </div>

      <ol v-else role="tabpanel" class="space-y-3 pt-4 text-sm">
        <li v-for="event in order.timeline" :key="event.id" class="flex gap-4">
          <span class="w-24 shrink-0 text-muted tabular-nums">{{ event.createdAt }}</span>
          <span>{{ event.label }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>
