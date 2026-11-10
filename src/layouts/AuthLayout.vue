<script setup lang="ts">
import UIcon from '@nuxt/ui/components/Icon.vue'

import logoUrl from '@assets/images/Logo.svg'
import { useT } from '@shared/lib/i18n/I18n'

const { t } = useT()
const year = new Date().getFullYear()
const FEATURES = [
  { key: 'orders', icon: 'i-lucide-shopping-bag' },
  { key: 'inventory', icon: 'i-lucide-boxes' },
  { key: 'insights', icon: 'i-lucide-chart-line' },
] as const
</script>

<template>
  <div class="grid min-h-dvh bg-default lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
    <!-- Panel thương hiệu: chỉ hiện từ lg. Chất editorial chỉ qua chữ, khoảng trắng và accent (DESIGN.md). -->
    <aside class="hidden border-e border-default bg-muted p-12 lg:flex lg:flex-col lg:justify-between">
      <div class="flex items-center gap-3">
        <img :src="logoUrl" alt="" class="size-10 rounded-md" />
        <span class="text-lg font-bold text-highlighted">{{ t('common.appName') }}</span>
      </div>

      <div class="max-w-md space-y-6">
        <p class="font-display text-3xl leading-tight font-semibold text-balance text-highlighted xl:text-4xl">
          {{ t('auth.brand.tagline') }}
        </p>
        <ul class="space-y-4">
          <li v-for="feature in FEATURES" :key="feature.key" class="flex items-center gap-3 text-default">
            <span
              class="flex size-9 shrink-0 items-center justify-center rounded-md border border-default bg-default text-primary"
            >
              <UIcon :name="feature.icon" class="size-5" aria-hidden="true" />
            </span>
            {{ t(`auth.brand.features.${feature.key}`) }}
          </li>
        </ul>
      </div>

      <p class="text-sm text-muted">{{ t('auth.brand.copyright', { year }) }}</p>
    </aside>

    <!-- Panel form -->
    <main class="flex items-center justify-center px-4 py-10 sm:px-8">
      <div class="w-full max-w-sm">
        <div class="mb-8 flex items-center gap-3 lg:hidden">
          <img :src="logoUrl" alt="" class="size-10 rounded-md" />
          <span class="text-lg font-bold text-highlighted">{{ t('common.appName') }}</span>
        </div>
        <RouterView />
      </div>
    </main>
  </div>
</template>
