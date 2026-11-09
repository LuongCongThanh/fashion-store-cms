<script setup lang="ts">
// PROTOTYPE A — "Dense table": filter inline 1 dòng, bảng compact có ảnh nhỏ, bulk bar thay header khi chọn.
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import { computed, ref } from 'vue'

import { products, statusMeta, vnd } from '@features/products/prototype/ProductFixture'
import ProductThumb from '@features/products/prototype/ProductThumb.vue'

const selected = ref<string[]>(['p-2', 'p-3'])
const allChecked = computed(() => selected.value.length === products.length)
const chips = ['Trạng thái: Đang bán', 'Danh mục: Đầm']
function toggle(id: string, value: boolean | 'indeterminate') {
  selected.value = value === true ? [...selected.value, id] : selected.value.filter((item) => item !== id)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="font-display text-2xl font-semibold text-highlighted">
        Sản phẩm <span class="text-base font-normal text-muted tabular-nums">· 248</span>
      </h1>
      <div class="flex gap-2">
        <UButton color="neutral" variant="outline">Xuất CSV</UButton>
        <UButton>Tạo sản phẩm</UButton>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <UInput placeholder="Tìm tên, SKU…" class="w-full sm:w-72" />
      <UButton color="neutral" variant="outline" size="sm">Trạng thái</UButton>
      <UButton color="neutral" variant="outline" size="sm">Danh mục</UButton>
      <UButton color="neutral" variant="outline" size="sm">Tồn kho</UButton>
      <span class="mx-1 hidden h-5 w-px bg-accented sm:block" />
      <UBadge v-for="chip in chips" :key="chip" color="primary" variant="soft" class="gap-1">
        {{ chip }} <button :aria-label="`Bỏ lọc ${chip}`">×</button>
      </UBadge>
      <UButton variant="link" size="sm" color="neutral">Xoá lọc</UButton>
    </div>

    <div class="overflow-x-auto rounded-lg border border-default">
      <table class="w-full min-w-[56rem] text-sm">
        <thead class="sticky top-0 z-10 bg-elevated text-left text-xs text-muted">
          <tr v-if="selected.length" class="bg-primary/10 text-default">
            <th class="w-10 px-3 py-2">
              <UCheckbox
                :modelValue="allChecked || 'indeterminate'"
                aria-label="Bỏ chọn"
                @update:modelValue="selected = []"
              />
            </th>
            <th colspan="6" class="px-3 py-1.5">
              <div class="flex items-center gap-2">
                <span class="font-medium">Đã chọn {{ selected.length }}</span>
                <UButton size="xs" variant="soft">Đăng bán</UButton>
                <UButton size="xs" variant="soft" color="neutral">Ẩn</UButton>
                <UButton size="xs" variant="soft" color="error">Xoá</UButton>
              </div>
            </th>
          </tr>
          <tr v-else>
            <th class="w-10 px-3 py-2">
              <UCheckbox aria-label="Chọn tất cả" @update:modelValue="selected = products.map((p) => p.id)" />
            </th>
            <th class="px-3 py-2 font-medium">Sản phẩm</th>
            <th class="px-3 py-2 font-medium">Danh mục</th>
            <th class="px-3 py-2 font-medium">Trạng thái</th>
            <th class="px-3 py-2 text-right font-medium">Tồn</th>
            <th class="px-3 py-2 text-right font-medium">Giá</th>
            <th class="px-3 py-2"><span class="sr-only">Hành động</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr
            v-for="product in products"
            :key="product.id"
            :class="selected.includes(product.id) ? 'bg-primary/5' : 'hover:bg-elevated/50'"
          >
            <td class="px-3 py-1.5">
              <UCheckbox
                :modelValue="selected.includes(product.id)"
                :aria-label="`Chọn ${product.name}`"
                @update:modelValue="toggle(product.id, $event)"
              />
            </td>
            <td class="px-3 py-1.5">
              <div class="flex items-center gap-3">
                <ProductThumb :name="product.name" :swatch="product.swatch" />
                <div class="min-w-0">
                  <RouterLink
                    :to="`/products/${product.id}`"
                    class="line-clamp-1 max-w-80 font-medium hover:text-primary"
                    :title="product.name"
                    >{{ product.name }}</RouterLink
                  >
                  <p class="font-mono text-xs text-muted">{{ product.sku }} · {{ product.variants }} biến thể</p>
                </div>
              </div>
            </td>
            <td class="px-3 py-1.5 text-muted">{{ product.category }}</td>
            <td class="px-3 py-1.5">
              <UBadge :color="statusMeta[product.status].color" variant="subtle">{{
                statusMeta[product.status].label
              }}</UBadge>
            </td>
            <td
              class="px-3 py-1.5 text-right tabular-nums"
              :class="product.stock === 0 ? 'text-error' : product.stock < 5 ? 'text-warning' : ''"
            >
              {{ product.stock === 0 ? 'Hết' : product.stock }}
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums">
              <span v-if="product.salePrice" class="block text-xs text-muted line-through">{{
                vnd(product.price)
              }}</span>
              {{ vnd(product.salePrice ?? product.price) }}
            </td>
            <td class="px-3 py-1.5 text-right">
              <UButton size="xs" variant="ghost" color="neutral" :aria-label="`Thao tác ${product.name}`">⋯</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex items-center justify-between text-sm text-muted">
      <span class="tabular-nums">1–8 / 248</span>
      <div class="flex gap-1">
        <UButton size="sm" color="neutral" variant="outline" disabled>Trước</UButton>
        <UButton size="sm" color="neutral" variant="outline">Sau</UButton>
      </div>
    </div>
  </div>
</template>
