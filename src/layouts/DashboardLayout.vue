<script setup lang="ts">
import { watch } from 'vue'

import OfflineBanner from '@shared/components/feedback/OfflineBanner.vue'
import PageContainer from '@shared/components/page/PageContainer.vue'
import { useNotify } from '@shared/composables/UseNotify'
import { usePwa } from '@shared/composables/UsePwa'

import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'

const notify = useNotify()
const { needRefresh, reload } = usePwa()

// Có bản mới → toast + nút Tải lại; không tự reload để không mất dữ liệu form (§R.2).
watch(needRefresh, (hasUpdate) => {
  if (hasUpdate) notify.prompt('pwa.updateAvailable', { label: 'pwa.reload', onClick: () => void reload() })
})
</script>

<template>
  <div class="flex min-h-screen bg-default text-default">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <OfflineBanner />
      <AppHeader />
      <main>
        <PageContainer><RouterView /></PageContainer>
      </main>
    </div>
  </div>
</template>
