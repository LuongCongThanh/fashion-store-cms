<script setup lang="ts">
// PROTOTYPE (Phase 0.5) — 3 biến thể Dashboard trên route dev `/prototype/*`, chọn bằng `?variant=A|B|C`. Chỉ có khi DEV.
import DashboardVariantA from '@features/dashboard/prototype/DashboardVariantA.vue'
import DashboardVariantB from '@features/dashboard/prototype/DashboardVariantB.vue'
import DashboardVariantC from '@features/dashboard/prototype/DashboardVariantC.vue'
import PrototypeSwitcher from '@shared/components/prototype/PrototypeSwitcher.vue'
import { usePrototypeVariant } from '@shared/composables/UsePrototypeVariant'

const variant = usePrototypeVariant(['A', 'B', 'C'])
const variants = [
  { key: 'A', name: 'Action-first', component: DashboardVariantA },
  { key: 'B', name: 'Editorial report', component: DashboardVariantB },
  { key: 'C', name: 'Ops console', component: DashboardVariantC },
]
</script>

<template>
  <div class="pb-20">
    <component :is="variants.find((item) => item.key === variant)?.component" />
    <PrototypeSwitcher :variants="variants" :current="variant" />
  </div>
</template>
