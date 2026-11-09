<script setup lang="ts">
// PROTOTYPE C — "Editorial gallery": ảnh là trung tâm (lưới 3:4), thao tác nhanh trên thẻ, toggle sang list.
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UInput from '@nuxt/ui/components/Input.vue'

import { categories, products, statusMeta, vnd } from '@features/products/prototype/ProductFixture'
import ProductThumb from '@features/products/prototype/ProductThumb.vue'
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4 border-b border-default pb-4">
      <div>
        <p class="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Catalog</p>
        <h1 class="mt-1 font-display text-3xl font-semibold text-highlighted">Sản phẩm</h1>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <UInput placeholder="Tìm…" class="w-48" />
        <div class="flex rounded-md border border-default p-0.5" role="group" aria-label="Kiểu hiển thị">
          <UButton size="xs" color="neutral" variant="solid" aria-pressed="true">Lưới</UButton>
          <UButton size="xs" color="neutral" variant="ghost" aria-pressed="false">Danh sách</UButton>
        </div>
        <UButton>Tạo sản phẩm</UButton>
      </div>
    </header>

    <div class="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Danh mục">
      <UButton size="sm" variant="solid" color="neutral" class="rounded-full">Tất cả</UButton>
      <UButton
        v-for="category in categories"
        :key="category"
        size="sm"
        variant="outline"
        color="neutral"
        class="shrink-0 rounded-full"
      >
        {{ category }}
      </UButton>
    </div>

    <ul class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      <li v-for="product in products" :key="product.id" class="group relative">
        <div class="relative">
          <ProductThumb :name="product.name" :swatch="product.swatch" size="lg" />
          <UBadge :color="statusMeta[product.status].color" variant="solid" size="sm" class="absolute top-2 left-2">
            {{ statusMeta[product.status].label }}
          </UBadge>
          <UBadge v-if="product.stock === 0" color="error" variant="solid" size="sm" class="absolute top-2 right-2">
            Hết hàng
          </UBadge>
          <div
            class="absolute inset-x-2 bottom-2 flex gap-1 opacity-100 transition-opacity motion-reduce:transition-none sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
          >
            <UButton
              size="xs"
              color="neutral"
              variant="solid"
              class="flex-1 justify-center"
              :to="`/products/${product.id}/edit`"
            >
              Sửa
            </UButton>
            <UButton size="xs" color="neutral" variant="solid" :aria-label="`Thao tác ${product.name}`">⋯</UButton>
          </div>
        </div>
        <RouterLink :to="`/products/${product.id}`" class="mt-3 line-clamp-2 text-sm font-medium hover:text-primary">
          {{ product.name }}
        </RouterLink>
        <p class="mt-1 flex items-baseline gap-2 text-sm tabular-nums">
          <span class="font-semibold">{{ vnd(product.salePrice ?? product.price) }}</span>
          <span v-if="product.salePrice" class="text-xs text-muted line-through">{{ vnd(product.price) }}</span>
        </p>
        <p class="text-xs text-muted">{{ product.variants }} biến thể · tồn {{ product.stock }}</p>
      </li>
    </ul>
  </div>
</template>
