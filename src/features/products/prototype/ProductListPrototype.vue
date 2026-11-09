<script setup lang="ts">
// PROTOTYPE (Phase 0.5) — 3 biến thể Product list trên route dev `/prototype/*`, chọn bằng `?variant=A|B|C`. Chỉ có khi DEV.
import ProductListVariantA from '@features/products/prototype/ProductListVariantA.vue'
import ProductListVariantB from '@features/products/prototype/ProductListVariantB.vue'
import ProductListVariantC from '@features/products/prototype/ProductListVariantC.vue'
import PrototypeSwitcher from '@shared/components/prototype/PrototypeSwitcher.vue'
import { usePrototypeVariant } from '@shared/composables/UsePrototypeVariant'

const variant = usePrototypeVariant(['A', 'B', 'C'])
const variants = [
  { key: 'A', name: 'Dense table', component: ProductListVariantA },
  { key: 'B', name: 'Faceted sidebar', component: ProductListVariantB },
  { key: 'C', name: 'Editorial gallery', component: ProductListVariantC },
]
</script>

<template>
  <div class="pb-20">
    <component :is="variants.find((item) => item.key === variant)?.component" />
    <PrototypeSwitcher :variants="variants" :current="variant" />
  </div>
</template>
