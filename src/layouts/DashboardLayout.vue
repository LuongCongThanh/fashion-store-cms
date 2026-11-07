<script setup lang="ts">
import { watch } from 'vue'

import OfflineBanner from '@shared/components/feedback/OfflineBanner.vue'
import { useNotify } from '@shared/composables/UseNotify'
import { usePwa } from '@shared/composables/UsePwa'

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
  <div class="bg-default text-default min-h-screen">
    <OfflineBanner />
    <header class="border-default flex h-14 items-center justify-between border-b px-6">
      <StoreSwitcher />
      <UserMenu />
    </header>
    <main class="mx-auto max-w-screen-2xl p-4 lg:p-6">
      <RouterView />
    </main>
  </div>
</template>
