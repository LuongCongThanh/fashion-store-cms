<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UNavigationMenu from '@nuxt/ui/components/NavigationMenu.vue'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

import { useNavigation } from '@layouts/Navigation'
import { useT } from '@shared/lib/i18n/I18n'

import type { MessageKey } from '@shared/lib/i18n/I18n'

const { t } = useT()
const navigation = useNavigation()
const isCollapsed = useLocalStorage('cms.sidebarCollapsed', false)

// Chỉ render kết quả của Navigation, không tự đọc route meta (§V.3).
const groups = computed(() =>
  navigation.value.sidebarGroups.map((group) => ({
    title: group.titleKey ? t(group.titleKey as MessageKey) : null,
    items: group.items.map((item) => ({
      label: t(item.titleKey as MessageKey),
      icon: item.icon,
      to: item.path,
    })),
  })),
)
</script>

<template>
  <aside
    class="hidden shrink-0 flex-col border-r border-default bg-muted transition-[width] duration-150 lg:flex"
    :class="isCollapsed ? 'w-16' : 'w-64'"
  >
    <div class="flex h-14 items-center justify-between px-4">
      <span v-if="!isCollapsed" class="font-display text-base font-bold">{{
        t('common.appName')
      }}</span>
      <UButton
        :icon="isCollapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
        color="neutral"
        variant="ghost"
        :aria-label="t('nav.collapse')"
        @click="isCollapsed = !isCollapsed"
      />
    </div>
    <div v-for="(group, index) in groups" :key="index" class="py-2">
      <p v-if="group.title && !isCollapsed" class="px-4 text-xs font-semibold text-muted">
        {{ group.title }}
      </p>
      <UNavigationMenu
        :items="group.items"
        orientation="vertical"
        :collapsed="isCollapsed"
        class="px-2"
      />
    </div>
  </aside>
</template>
