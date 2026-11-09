<script setup lang="ts">
import UDashboardGroup from '@nuxt/ui/components/DashboardGroup.vue'
import UDashboardPanel from '@nuxt/ui/components/DashboardPanel.vue'

import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

// Khung app theo cách ghép của nuxt-ui-templates/dashboard; luật ở DESIGN.md mục Layout.
</script>

<template>
  <UDashboardGroup storage="local" storageKey="cms.dashboard" unit="px">
    <AppSidebar />
    <UDashboardPanel id="main">
      <template #header>
        <slot name="banner" />
        <AppHeader />
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
