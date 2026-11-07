<script setup lang="ts">
import { watch } from 'vue'

import OfflineBanner from '@shared/components/feedback/OfflineBanner.vue'
import { useNotify } from '@shared/composables/UseNotify'
import { usePwa } from '@shared/composables/UsePwa'

import AppSidebar from './components/AppSidebar.vue'
import StoreSwitcher from './components/StoreSwitcher.vue'
import UserMenu from './components/UserMenu.vue'

const notify = useNotify()
const { needRefresh, reload } = usePwa()

// Có bản mới → toast + nút Tải lại; không tự reload để không mất dữ liệu form (§R.2).
watch(needRefresh, (hasUpdate) => {
  if (hasUpdate)
    notify.prompt('pwa.updateAvailable', { label: 'pwa.reload', onClick: () => void reload() })
})
</script>

<template>
  <div class="flex min-h-screen bg-default text-default">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <OfflineBanner />
      <header class="flex h-14 items-center justify-between border-b border-default px-6">
        <StoreSwitcher />
        <UserMenu />
      </header>
      <main class="mx-auto w-full max-w-screen-2xl p-4 lg:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
