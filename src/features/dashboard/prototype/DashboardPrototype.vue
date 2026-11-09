<script setup lang="ts">
// PROTOTYPE (Phase 0.5) — 3 biến thể Dashboard trên route thật, chọn bằng `?variant=A|B|C`. Không merge.
import DashboardVariantA from '@features/dashboard/prototype/DashboardVariantA.vue'
import DashboardVariantB from '@features/dashboard/prototype/DashboardVariantB.vue'
import DashboardVariantC from '@features/dashboard/prototype/DashboardVariantC.vue'
import PrototypeSwitcher from '@shared/components/prototype/PrototypeSwitcher.vue'

defineProps<{ variant: string }>()
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
