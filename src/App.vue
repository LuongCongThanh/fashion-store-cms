<script setup lang="ts">
import UApp from '@nuxt/ui/components/App.vue'
import { defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import { useLocale } from '@shared/lib/i18n/I18n'

const { uiLocale } = useLocale()

/**
 * Điều hướng đầu tiên chờ khôi phục phiên (refresh cookie + /auth/me) trong guard.
 * Hiện skeleton thay vì màn trắng; lỗi (vd. mất mạng) hiện ErrorState để tải lại.
 */
const boot = ref<'loading' | 'ready' | { error: unknown }>('loading')
useRouter()
  .isReady()
  .then(() => (boot.value = 'ready'))
  .catch((error: unknown) => (boot.value = { error }))

function reload() {
  window.location.reload()
}

// Xem cache query — chỉ tải khi dev (§S.2), không vào bundle production.
const VueQueryDevtools = import.meta.env.DEV
  ? defineAsyncComponent(() => import('@tanstack/vue-query-devtools').then((m) => m.VueQueryDevtools))
  : null
</script>

<template>
  <UApp :locale="uiLocale">
    <RouterView v-if="boot === 'ready'" />
    <div v-else class="mx-auto w-full max-w-md p-6">
      <LoadingState v-if="boot === 'loading'" />
      <ErrorState v-else :error="boot.error" @retry="reload" />
    </div>
    <component :is="VueQueryDevtools" v-if="VueQueryDevtools" />
  </UApp>
</template>
