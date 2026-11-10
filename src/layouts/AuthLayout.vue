<script setup lang="ts">
import UIcon from '@nuxt/ui/components/Icon.vue'

import logoUrl from '@assets/images/Logo.svg'
import { useT } from '@shared/lib/i18n/I18n'

import AuthHero3D from './components/AuthHero3D.vue'

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
    <!-- Panel thương hiệu: chỉ hiện từ lg, thuần trang trí + giới thiệu -->
    <aside
      class="relative hidden overflow-hidden bg-linear-to-br from-primary-600 via-primary-500 to-primary-700 p-12 text-white lg:flex lg:flex-col lg:justify-between"
    >
      <div aria-hidden="true" class="pointer-events-none absolute inset-0">
        <div class="absolute -top-24 -left-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div class="absolute -right-32 bottom-0 size-[28rem] rounded-full bg-black/10 blur-3xl" />
        <div
          class="absolute inset-0 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.07]"
        />
      </div>

      <div class="relative flex items-center gap-3">
        <img :src="logoUrl" alt="" class="size-10 rounded-xl shadow-lg ring-1 ring-white/30" />
        <span class="text-lg font-bold tracking-tight">{{ t('common.appName') }}</span>
      </div>

      <AuthHero3D class="relative -my-4" />

      <div class="relative max-w-md space-y-6">
        <p class="font-display text-3xl leading-tight font-bold text-balance xl:text-4xl">
          {{ t('auth.brand.tagline') }}
        </p>
        <ul class="space-y-4">
          <li v-for="feature in FEATURES" :key="feature.key" class="flex items-center gap-3 text-white/90">
            <span
              class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20 backdrop-blur"
            >
              <UIcon :name="feature.icon" class="size-5" aria-hidden="true" />
            </span>
            {{ t(`auth.brand.features.${feature.key}`) }}
          </li>
        </ul>
      </div>

      <p class="relative text-sm text-white/70">{{ t('auth.brand.copyright', { year }) }}</p>
    </aside>

    <!-- Panel form -->
    <main class="relative flex items-center justify-center px-4 py-10 sm:px-8">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-primary/10 to-transparent lg:hidden"
      />
      <div class="relative w-full max-w-sm">
        <div class="mb-8 flex items-center gap-3 lg:hidden">
          <img :src="logoUrl" alt="" class="size-10 rounded-xl shadow-md" />
          <span class="text-lg font-bold tracking-tight text-highlighted">{{ t('common.appName') }}</span>
        </div>
        <RouterView />
      </div>
    </main>
  </div>
</template>
