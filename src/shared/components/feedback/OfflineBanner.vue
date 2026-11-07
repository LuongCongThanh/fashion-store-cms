<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import { useOnline } from '@vueuse/core'

import { useT } from '@shared/lib/i18n/I18n'

/** Banner cố định đầu trang khi mất mạng (§R.2). */
const { t } = useT()
const isOnline = useOnline()
</script>

<template>
  <UAlert
    v-if="!isOnline"
    data-testid="offline-banner"
    color="warning"
    variant="solid"
    icon="i-lucide-wifi-off"
    :title="t('pwa.offline')"
    class="sticky top-0 z-10 rounded-none"
  />
</template>
