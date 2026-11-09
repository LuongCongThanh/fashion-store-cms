<script setup lang="ts">
import { watch } from 'vue'

import OfflineBanner from '@shared/components/feedback/OfflineBanner.vue'
import PageContainer from '@shared/components/page/PageContainer.vue'
import { useNotify } from '@shared/composables/UseNotify'
import { usePwa } from '@shared/composables/UsePwa'

import AppShell from './components/AppShell.vue'

const notify = useNotify()
const { needRefresh, reload } = usePwa()

// Có bản mới → toast + nút Tải lại; không tự reload để không mất dữ liệu form (§R.2).
watch(needRefresh, (hasUpdate) => {
  if (hasUpdate) notify.prompt('pwa.updateAvailable', { label: 'pwa.reload', onClick: () => void reload() })
})
</script>

<template>
  <AppShell>
    <template #banner><OfflineBanner /></template>
    <PageContainer><RouterView /></PageContainer>
  </AppShell>
</template>
