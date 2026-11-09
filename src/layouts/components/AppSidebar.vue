<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { useLocalStorage } from '@vueuse/core'

import { useT } from '@shared/lib/i18n/I18n'

import SidebarNav from './SidebarNav.vue'

const { t } = useT()
const isCollapsed = useLocalStorage('cms.sidebarCollapsed', false)
</script>

<template>
  <aside
    class="hidden shrink-0 flex-col border-r border-default bg-muted transition-[width] duration-150 lg:flex"
    :class="isCollapsed ? 'w-16' : 'w-64'"
  >
    <div class="flex h-14 items-center justify-between px-4">
      <span v-if="!isCollapsed" class="font-display text-base font-bold">{{ t('common.appName') }}</span>
      <UButton
        :icon="isCollapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
        color="neutral"
        variant="ghost"
        :aria-label="t('nav.collapse')"
        @click="isCollapsed = !isCollapsed"
      />
    </div>
    <SidebarNav :collapsed="isCollapsed" />
  </aside>
</template>
