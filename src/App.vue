<script setup lang="ts">
import UApp from '@nuxt/ui/components/App.vue'
import { defineAsyncComponent } from 'vue'

import { useLocale } from '@shared/lib/i18n/I18n'

const { uiLocale } = useLocale()

// Xem cache query — chỉ tải khi dev (§S.2), không vào bundle production.
const VueQueryDevtools = import.meta.env.DEV
  ? defineAsyncComponent(() =>
      import('@tanstack/vue-query-devtools').then((m) => m.VueQueryDevtools),
    )
  : null
</script>

<template>
  <UApp :locale="uiLocale">
    <RouterView />
    <component :is="VueQueryDevtools" v-if="VueQueryDevtools" />
  </UApp>
</template>
