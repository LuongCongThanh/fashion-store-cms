<script setup lang="ts">
// PROTOTYPE (Phase 0.5) — 3 biến thể Order detail trên route dev `/prototype/*`, chọn bằng `?variant=A|B|C`. Chỉ có khi DEV.
import OrderDetailVariantA from '@features/orders/prototype/OrderDetailVariantA.vue'
import OrderDetailVariantB from '@features/orders/prototype/OrderDetailVariantB.vue'
import OrderDetailVariantC from '@features/orders/prototype/OrderDetailVariantC.vue'
import PrototypeSwitcher from '@shared/components/prototype/PrototypeSwitcher.vue'
import { usePrototypeVariant } from '@shared/composables/UsePrototypeVariant'

const variant = usePrototypeVariant(['A', 'B', 'C'])
const variants = [
  { key: 'A', name: 'Two-column', component: OrderDetailVariantA },
  { key: 'B', name: 'Lifecycle stepper', component: OrderDetailVariantB },
  { key: 'C', name: 'Invoice document', component: OrderDetailVariantC },
]
</script>

<template>
  <div class="pb-20">
    <component :is="variants.find((item) => item.key === variant)?.component" />
    <PrototypeSwitcher :variants="variants" :current="variant" />
  </div>
</template>
