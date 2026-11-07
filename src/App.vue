<script setup lang="ts">
import UApp from '@nuxt/ui/components/App.vue'

import { useLocale } from '@shared/lib/i18n/I18n'

const { uiLocale } = useLocale()
</script>

<template>
  <UApp :locale="uiLocale">
    <RouterView />
  </UApp>
</template>
