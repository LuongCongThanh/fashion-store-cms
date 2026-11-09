<script setup lang="ts">
// PROTOTYPE — ảnh giả: ô màu swatch, hoặc chữ viết tắt khi thiếu ảnh (missing image treatment).
import { initials } from '@features/products/prototype/ProductFixture'

defineProps<{ name: string; swatch?: string; size?: 'sm' | 'lg' }>()
</script>

<template>
  <div
    class="flex shrink-0 items-center justify-center overflow-hidden font-display font-semibold"
    :class="[
      size === 'lg' ? 'aspect-[3/4] w-full rounded-md text-2xl' : 'size-10 rounded text-xs',
      swatch ? '' : 'border border-dashed border-accented bg-elevated text-dimmed',
    ]"
    :style="
      swatch ? { background: `linear-gradient(160deg, ${swatch}, color-mix(in oklab, ${swatch} 70%, black))` } : {}
    "
    role="img"
    :aria-label="swatch ? `Ảnh ${name}` : `${name} chưa có ảnh`"
  >
    <span v-if="!swatch">{{ initials(name) }}</span>
  </div>
</template>
