<script setup lang="ts">
// PROTOTYPE B — "Faceted sidebar": tab saved views phía trên, panel lọc dạng facet bên trái, bảng thoáng bên phải.
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import { ref } from 'vue'

import { categories, products, statusMeta, vnd } from '@features/products/prototype/ProductFixture'
import ProductThumb from '@features/products/prototype/ProductThumb.vue'

const views = [
  { key: 'all', label: 'Tất cả', count: 248 },
  { key: 'live', label: 'Đang bán', count: 196 },
  { key: 'draft', label: 'Nháp', count: 31 },
  { key: 'out', label: 'Hết hàng', count: 14 },
  { key: 'sale', label: 'Đang giảm giá', count: 22 },
]
const view = ref('all')
const filtersOpen = ref(false)
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="font-display text-2xl font-semibold text-highlighted">Sản phẩm</h1>
      <UButton>Tạo sản phẩm</UButton>
    </div>

    <nav class="flex gap-1 overflow-x-auto border-b border-default" aria-label="Saved views">
      <button
        v-for="item in views"
        :key="item.key"
        class="-mb-px shrink-0 border-b-2 px-3 py-2 text-sm"
        :class="view === item.key ? 'border-primary font-medium text-highlighted' : 'border-transparent text-muted'"
        :aria-current="view === item.key ? 'page' : undefined"
        @click="view = item.key"
      >
        {{ item.label }} <span class="text-xs text-muted tabular-nums">{{ item.count }}</span>
      </button>
    </nav>

    <div class="grid gap-6 lg:grid-cols-[15rem_1fr]">
      <UButton class="lg:hidden" color="neutral" variant="outline" block @click="filtersOpen = !filtersOpen">
        Bộ lọc (2)
      </UButton>
      <aside class="space-y-6 text-sm" :class="filtersOpen ? '' : 'hidden lg:block'" aria-label="Bộ lọc">
        <UInput placeholder="Tìm tên, SKU…" class="w-full" />
        <fieldset class="space-y-2">
          <legend class="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Trạng thái</legend>
          <UCheckbox
            v-for="(meta, key) in statusMeta"
            :key="key"
            :label="meta.label"
            :defaultValue="key === 'published'"
          />
        </fieldset>
        <fieldset class="space-y-2">
          <legend class="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Danh mục</legend>
          <UCheckbox
            v-for="category in categories"
            :key="category"
            :label="category"
            :defaultValue="category === 'Đầm'"
          />
        </fieldset>
        <fieldset class="space-y-2">
          <legend class="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Giá</legend>
          <div class="flex items-center gap-2">
            <UInput placeholder="Từ" size="sm" />
            <span class="text-muted">–</span>
            <UInput placeholder="Đến" size="sm" />
          </div>
        </fieldset>
        <UButton variant="link" color="neutral" size="sm" class="px-0">Xoá tất cả bộ lọc</UButton>
      </aside>

      <div class="min-w-0">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[44rem] text-sm">
            <thead class="border-b border-default text-left text-xs text-muted">
              <tr>
                <th class="w-10 py-3 pr-3"><UCheckbox aria-label="Chọn tất cả" /></th>
                <th class="py-3 pr-3 font-medium">Sản phẩm</th>
                <th class="py-3 pr-3 font-medium">Trạng thái</th>
                <th class="py-3 pr-3 text-right font-medium">Tồn kho</th>
                <th class="py-3 text-right font-medium">Giá</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default">
              <tr v-for="product in products" :key="product.id" class="group">
                <td class="py-3 pr-3"><UCheckbox :aria-label="`Chọn ${product.name}`" /></td>
                <td class="py-3 pr-3">
                  <div class="flex items-center gap-3">
                    <ProductThumb :name="product.name" :swatch="product.swatch" />
                    <div class="min-w-0">
                      <RouterLink
                        :to="`/products/${product.id}`"
                        class="line-clamp-2 font-medium group-hover:text-primary"
                      >
                        {{ product.name }}
                      </RouterLink>
                      <p class="text-xs text-muted">{{ product.category }} · {{ product.sku }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 pr-3">
                  <UBadge :color="statusMeta[product.status].color" variant="subtle">
                    {{ statusMeta[product.status].label }}
                  </UBadge>
                </td>
                <td class="py-3 pr-3 text-right">
                  <span class="tabular-nums" :class="product.stock === 0 ? 'text-error' : ''">{{ product.stock }}</span>
                  <span class="block text-xs text-muted">{{ product.variants }} biến thể</span>
                </td>
                <td class="py-3 text-right tabular-nums">
                  {{ vnd(product.salePrice ?? product.price) }}
                  <UBadge v-if="product.salePrice" color="primary" variant="soft" size="sm" class="ml-1">−20%</UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4 text-center text-sm text-muted">
          Hiển thị 8 / 248 · <button class="text-primary">Tải thêm</button>
        </p>
      </div>
    </div>
  </div>
</template>
