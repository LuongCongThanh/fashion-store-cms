<script setup lang="ts">
import UDashboardSidebar from '@nuxt/ui/components/DashboardSidebar.vue'
import UDashboardSidebarCollapse from '@nuxt/ui/components/DashboardSidebarCollapse.vue'

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
    class="bg-muted"
  >
    <template #header="{ collapsed }">
      <StoreSwitcher :collapsed="collapsed" />
    </template>
    <template #default="{ collapsed }">
      <nav :aria-label="t('nav.menu')">
        <SidebarNav :collapsed="collapsed" />
      </nav>
    </template>
    <template #footer>
      <UDashboardSidebarCollapse class="hidden lg:inline-flex" />
    </template>
  </UDashboardSidebar>
</template>
