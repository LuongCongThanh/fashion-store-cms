<script setup lang="ts">
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UInput from '@nuxt/ui/components/Input.vue'

import { uiConfig } from '@app/config/Ui.config'

/** Trang duyệt token với designer (§L.10) — chỉ đăng ký route ở dev. */
type Color = keyof typeof uiConfig.colors
const COLORS = Object.keys(uiConfig.colors) as Color[]

const SURFACES = [
  { label: 'bg-default', cls: 'bg-default' },
  { label: 'bg-muted', cls: 'bg-muted' },
  { label: 'bg-elevated', cls: 'bg-elevated' },
] as const
const TEXTS = ['text-highlighted', 'text-default', 'text-muted', 'text-dimmed'] as const
</script>

<template>
  <div class="flex flex-col gap-8 p-6">
    <h1 class="font-display text-highlighted text-2xl font-semibold">Design system</h1>

    <section class="flex flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Màu ngữ nghĩa</h2>
      <div v-for="color in COLORS" :key="color" class="flex items-center gap-3">
        <span class="text-muted w-24 text-sm">{{ color }} → {{ uiConfig.colors[color] }}</span>
        <UButton :color="color">Button</UButton>
        <UButton :color="color" variant="outline">Outline</UButton>
        <UBadge :color="color">Badge</UBadge>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Nền / chữ</h2>
      <div class="flex gap-3">
        <div
          v-for="s in SURFACES"
          :key="s.label"
          :class="[s.cls, 'border-default rounded-lg border p-4 text-sm']"
        >
          {{ s.label }}
        </div>
      </div>
      <p v-for="t in TEXTS" :key="t" :class="[t, 'text-sm']">{{ t }}</p>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Typography</h2>
      <p class="font-display text-3xl font-bold tabular-nums">1.234.567 ₫</p>
      <p class="text-sm">Inter — Thời trang Việt Nam, áo dài, quần jean.</p>
      <p class="font-mono text-xs">SKU-0001-VN</p>
    </section>

    <section class="flex max-w-sm flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Form</h2>
      <UInput placeholder="Tên sản phẩm" />
    </section>
  </div>
</template>
