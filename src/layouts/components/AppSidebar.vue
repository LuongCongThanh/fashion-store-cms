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
  <UDashboardSidebar
    id="main"
    mode="slideover"
    collapsible
    :resizable="false"
    :defaultSize="WIDTH"
    :minSize="WIDTH"
    :maxSize="WIDTH"
    :collapsedSize="COLLAPSED_WIDTH"
    class="border-e border-default bg-muted"
    :ui="{
      header:
        'relative h-auto flex-col items-stretch gap-4 border-b border-default px-3 pt-4 pb-3 [&>button:first-child]:absolute [&>button:first-child]:top-4 [&>button:first-child]:right-3 [&>button:first-child]:z-10 [&>button:first-child]:size-9 [&>button:first-child]:p-2',
      body: 'px-0 py-3',
    }"
  >
    <template #header="{ collapsed }">
      <UDashboardSidebarCollapse
        class="absolute top-5 -right-3.5 z-20 hidden size-7 cursor-pointer rounded-full bg-default p-1.5 ring-1 ring-default lg:inline-flex"
      />
      <RouterLink
        to="/"
        class="flex min-h-10 items-center gap-3 rounded-md px-1.5 pe-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:pe-1.5"
        :class="collapsed && 'justify-center px-0'"
        :aria-label="collapsed ? t('common.appName') : undefined"
      >
        <span
          class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-inverted ring-1 ring-primary"
        >
          <UIcon name="i-lucide-shirt" class="size-[19px]" aria-hidden="true" />
        </span>
        <span v-if="!collapsed" class="min-w-0 leading-tight">
          <span class="block truncate font-display text-base font-semibold tracking-tight text-highlighted">{{
            t('common.brandName')
          }}</span>
          <span class="mt-0.5 block text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">{{
            t('common.adminConsole')
          }}</span>
        </span>
      </RouterLink>
      <StoreSwitcher :collapsed="collapsed" />
    </template>
    <template #default="{ collapsed }">
      <nav :aria-label="t('nav.menu')">
        <SidebarNav :collapsed="collapsed" />
      </nav>
    </template>
  </UDashboardSidebar>
</template>
