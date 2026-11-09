<script setup lang="ts">
// PROTOTYPE (Phase 0.5) — 3 biến thể Order detail trên route thật, `?variant=A|B|C`. Không merge.
import OrderDetailVariantA from '@features/orders/prototype/OrderDetailVariantA.vue'
import OrderDetailVariantB from '@features/orders/prototype/OrderDetailVariantB.vue'
import OrderDetailVariantC from '@features/orders/prototype/OrderDetailVariantC.vue'
import PrototypeSwitcher from '@shared/components/prototype/PrototypeSwitcher.vue'

defineProps<{ variant: string }>()
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
