<script setup lang="ts">
import UNavigationMenu from '@nuxt/ui/components/NavigationMenu.vue'
import { computed } from 'vue'

import { useNavigation } from '@layouts/Navigation'
import { useT } from '@shared/lib/i18n/I18n'

import type { MessageKey } from '@shared/lib/i18n/I18n'

defineProps<{ collapsed?: boolean }>()

const { t } = useT()
const navigation = useNavigation()

// Chỉ render kết quả của Navigation, không tự đọc route meta (§V.3).
const groups = computed(() =>
  navigation.value.sidebarGroups.map((group) => ({
    title: group.titleKey ? t(group.titleKey as MessageKey) : null,
    items: group.items.map((item) => ({
      label: t(item.titleKey as MessageKey),
      icon: item.icon,
      to: item.path,
      // "/" là tiền tố của mọi route → chỉ active khi khớp chính xác, tránh "Tổng quan" sáng cùng mục khác.
      exact: item.path === '/',
    })),
  })),
)

// Một kiểu item cho mọi nhóm: idle muted, hover nền elevated, active nền primary/10 + chữ primary (DESIGN.md: item nav active).
const LINK_UI = {
  list: 'gap-0.5',
  link: 'min-h-9 cursor-pointer rounded-md px-2.5 py-2 text-sm font-medium text-muted transition-colors duration-150 before:rounded-md before:transition-colors before:duration-150 hover:text-highlighted hover:before:bg-elevated data-active:text-primary data-active:before:bg-primary/10 data-active:hover:before:bg-primary/10 focus-visible:before:outline-2 focus-visible:before:outline-offset-0 focus-visible:before:outline-primary motion-reduce:transition-none motion-reduce:before:transition-none',
  linkLeadingIcon: 'size-5 text-muted group-hover:text-highlighted group-data-active:text-primary',
}
</script>

<template>
  <div class="space-y-4">
    <section v-for="(group, index) in groups" :key="index">
      <p v-if="group.title && !collapsed" class="mb-1 px-2.5 text-xs font-semibold tracking-wider text-muted uppercase">
        {{ group.title }}
      </p>
      <div v-else-if="index" aria-hidden="true" class="mx-2 mb-3 border-t border-default" />
      <UNavigationMenu :items="group.items" orientation="vertical" :collapsed="collapsed" tooltip :ui="LINK_UI" />
    </section>
  </div>
</template>
