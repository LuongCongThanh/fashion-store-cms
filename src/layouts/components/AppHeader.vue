<script setup lang="ts">
import UDashboardNavbar from '@nuxt/ui/components/DashboardNavbar.vue'

import AppBreadcrumb from './AppBreadcrumb.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import UserMenu from './UserMenu.vue'
</script>

<template>
  <!-- Toggle sidebar (dưới lg) do UDashboardNavbar render sẵn; tiêu đề trang nằm ở PageHeader, không lặp ở đây -->
  <UDashboardNavbar
    :ui="{
      root: 'sticky top-0 z-10 bg-default/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-default/70 lg:px-6',
      left: 'min-w-0',
      right: 'gap-1',
    }"
  >
    <template #title>
      <AppBreadcrumb />
    </template>
    <template #right>
      <!-- Dưới lg: locale + theme nằm trong UserMenu để header không vỡ hàng ở 375px -->
      <LanguageSwitcher class="hidden lg:block" />
      <ThemeSwitcher class="hidden lg:block" />
      <span aria-hidden="true" class="mx-1 hidden h-6 w-px bg-(--ui-border) lg:block" />
      <UserMenu />
    </template>
  </UDashboardNavbar>
</template>
