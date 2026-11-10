<script setup lang="ts">
import UIcon from '@nuxt/ui/components/Icon.vue'
import { useMouseInElement, usePreferredReducedMotion } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'

/**
 * Cảnh 3D trang trí cho panel thương hiệu ở trang auth: chồng thẻ "dashboard" giả trong không gian
 * perspective, nghiêng theo chuột. Thuần CSS transform (không WebGL), aria-hidden, tắt chuyển động
 * khi người dùng bật reduced-motion.
 */
const scene = useTemplateRef<HTMLElement>('scene')
const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(scene)
const reduced = usePreferredReducedMotion()

const MAX_TILT = 10
const tilt = computed(() => {
  if (reduced.value === 'reduce' || isOutside.value || !elementWidth.value) return { x: 0, y: 0 }
  const px = elementX.value / elementWidth.value - 0.5
  const py = elementY.value / elementHeight.value - 0.5
  return { x: -py * MAX_TILT * 2, y: px * MAX_TILT * 2 }
})
const sceneStyle = computed(() => ({
  transform: `rotateX(${18 + tilt.value.x}deg) rotateY(${-22 + tilt.value.y}deg) rotateZ(4deg)`,
}))
const BARS = [38, 62, 45, 80, 58, 92, 70]
</script>

<template>
  <!-- eslint-disable vue/no-bare-strings-in-template -- dữ liệu giả trang trí, aria-hidden, không phải nội dung UI -->
  <div ref="scene" aria-hidden="true" class="relative h-80 w-full select-none [perspective:1200px]">
    <div
      class="absolute inset-0 transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
      :style="sceneStyle"
    >
      <!-- Thẻ nền: biểu đồ doanh thu -->
      <div
        class="hero-float absolute top-6 left-4 w-72 [transform:translateZ(0px)] rounded-2xl bg-white/95 p-5 text-neutral-800 shadow-2xl shadow-black/30"
      >
        <div class="mb-1 text-xs font-medium text-neutral-500">Revenue</div>
        <div class="mb-4 text-2xl font-bold tabular-nums">₫128.4M</div>
        <div class="flex h-24 items-end gap-2">
          <div
            v-for="(height, index) in BARS"
            :key="index"
            class="flex-1 rounded-t-md bg-linear-to-t from-primary-500 to-primary-300"
            :style="{ height: `${height}%` }"
          />
        </div>
      </div>

      <!-- Thẻ giữa: đơn hàng mới -->
      <div
        class="hero-float hero-delay-1 absolute top-40 left-52 w-60 [transform:translateZ(70px)] rounded-2xl bg-white p-4 text-neutral-800 shadow-2xl shadow-black/30"
      >
        <div class="flex items-center gap-3">
          <span class="flex size-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <UIcon name="i-lucide-shopping-bag" class="size-5" />
          </span>
          <div class="min-w-0">
            <div class="text-sm font-semibold">#ORD-2048</div>
            <div class="text-xs text-neutral-500">Linen shirt × 2</div>
          </div>
          <span class="ms-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Paid
          </span>
        </div>
      </div>

      <!-- Thẻ trước: tồn kho -->
      <div
        class="hero-float hero-delay-2 absolute top-0 left-64 w-44 [transform:translateZ(130px)] rounded-2xl bg-neutral-900/90 p-4 text-white shadow-2xl ring-1 shadow-black/40 ring-white/10 backdrop-blur"
      >
        <div class="mb-2 flex items-center gap-2 text-xs text-white/70">
          <UIcon name="i-lucide-boxes" class="size-4" /> Stock
        </div>
        <div class="text-xl font-bold tabular-nums">1,284</div>
        <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div class="h-full w-3/4 rounded-full bg-primary-400" />
        </div>
      </div>

      <!-- Khối hình học trang trí -->
      <div
        class="hero-float hero-delay-1 absolute top-64 left-0 size-16 [transform:translateZ(110px)_rotate(18deg)] rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur"
      />
      <div
        class="hero-float hero-delay-2 absolute -top-4 left-48 size-10 [transform:translateZ(180px)] rounded-full bg-linear-to-br from-white/60 to-white/10 shadow-lg"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes hero-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -10px;
  }
}
.hero-float {
  animation: hero-float 6s ease-in-out infinite;
}
.hero-delay-1 {
  animation-delay: -2s;
}
.hero-delay-2 {
  animation-delay: -4s;
}
@media (prefers-reduced-motion: reduce) {
  .hero-float {
    animation: none;
  }
}
</style>
