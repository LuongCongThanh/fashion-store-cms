<script setup lang="ts">
// PROTOTYPE (Phase 0.5 UI/UX hardening) — thanh chuyển biến thể nổi, chỉ có trong route dev `/prototype/*`.
import { useEventListener } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useTheme } from '@shared/composables/UseTheme'

const props = defineProps<{ variants: { key: string; name: string }[]; current: string }>()
const route = useRoute()
const router = useRouter()
const index = computed(() => props.variants.findIndex((variant) => variant.key === props.current))
const active = computed(() => props.variants[index.value])

function go(step: number) {
  const next = props.variants[(index.value + step + props.variants.length) % props.variants.length]
  if (next) void router.replace({ query: { ...route.query, variant: next.key } })
}
const { mode } = useTheme()
function toggleTheme() {
  mode.value = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
}

useEventListener('keydown', (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null
  if (target?.closest('input, textarea, select, [contenteditable]')) return
  if (event.key === 'ArrowLeft') go(-1)
  if (event.key === 'ArrowRight') go(1)
})
</script>

<template>
  <div
    class="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full bg-black px-2 py-1.5 font-mono text-xs text-white shadow-2xl ring-2 ring-yellow-300"
    role="toolbar"
    aria-label="Prototype variant switcher"
  >
    <button class="rounded-full px-2 py-1 hover:bg-white/20" aria-label="Previous variant" @click="go(-1)">←</button>
    <span class="min-w-48 text-center">
      <strong class="text-yellow-300">{{ active?.key }}</strong> · {{ active?.name }}
    </span>
    <button class="rounded-full px-2 py-1 hover:bg-white/20" aria-label="Next variant" @click="go(1)">→</button>
    <span class="mx-1 h-4 w-px bg-white/30" />
    <button class="rounded-full px-2 py-1 hover:bg-white/20" @click="toggleTheme">light/dark</button>
  </div>
</template>
