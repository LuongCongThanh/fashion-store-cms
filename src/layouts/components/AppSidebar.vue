<script setup lang="ts">
import UDashboardSidebar from '@nuxt/ui/components/DashboardSidebar.vue'
import UDashboardSidebarCollapse from '@nuxt/ui/components/DashboardSidebarCollapse.vue'
import UIcon from '@nuxt/ui/components/Icon.vue'

import { useT } from '@shared/lib/i18n/I18n'

import SidebarNav from './SidebarNav.vue'
import StoreSwitcher from './StoreSwitcher.vue'

const { t } = useT()

// DESIGN.md: rộng cố định 256px, thu gọn 64px; dưới lg là slideover từ trái, tự đóng khi đổi route.
const WIDTH = 256
const COLLAPSED_WIDTH = 64
</script>

<template>
  <!-- Header sidebar cao bằng navbar (--ui-header-height) để hai đường viền dưới thẳng hàng. -->
  <UDashboardSidebar
    id="main"
    mode="slideover"
    toggleSide="right"
    collapsible
    :resizable="false"
    :defaultSize="WIDTH"
    :minSize="WIDTH"
    :maxSize="WIDTH"
    :collapsedSize="COLLAPSED_WIDTH"
    class="border-e border-default bg-muted"
    :ui="{
      header: 'gap-2 border-b border-default px-3',
      body: 'gap-4 px-0 py-3',
      footer: 'hidden border-t border-default px-0 py-2 lg:flex',
    }"
  >
    <template #header="{ collapsed }">
      <RouterLink
        to="/"
        class="flex min-w-0 flex-1 items-center gap-2.5 rounded-md p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :class="collapsed && 'justify-center'"
        :aria-label="collapsed ? t('common.appName') : undefined"
      >
        <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-inverted">
          <UIcon name="i-lucide-shirt" class="size-4.5" aria-hidden="true" />
        </span>
        <span v-if="!collapsed" class="min-w-0 leading-tight">
          <span class="block truncate text-sm font-semibold text-highlighted">{{ t('common.brandName') }}</span>
          <span class="block truncate text-xs text-muted">{{ t('common.adminConsole') }}</span>
        </span>
      </RouterLink>
    </template>

    <template #default="{ collapsed }">
      <div :class="collapsed ? 'px-2' : 'px-3'">
        <StoreSwitcher :collapsed="collapsed" />
      </div>
      <nav :aria-label="t('nav.menu')" :class="collapsed ? 'px-2' : 'px-3'">
        <SidebarNav :collapsed="collapsed" />
      </nav>
    </template>

    <template #footer="{ collapsed }">
      <div class="flex w-full" :class="collapsed ? 'justify-center px-2' : 'px-3'">
        <UDashboardSidebarCollapse
          color="neutral"
          variant="ghost"
          :block="!collapsed"
          :square="collapsed"
          :label="collapsed ? undefined : t('nav.collapse')"
          class="min-h-9 cursor-pointer text-muted transition-colors duration-150 hover:text-highlighted motion-reduce:transition-none"
          :class="!collapsed && 'justify-start px-2.5'"
        />
      </div>
    </template>
  </UDashboardSidebar>
</template>
