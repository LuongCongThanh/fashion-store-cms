<script setup lang="ts">
import UDashboardNavbar from '@nuxt/ui/components/DashboardNavbar.vue'

import AppBreadcrumb from './AppBreadcrumb.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import UserMenu from './UserMenu.vue'
</script>

<template>
  <!-- Toggle sidebar (dưới lg) do UDashboardNavbar render sẵn; tiêu đề trang nằm ở PageHeader, không lặp ở đây.
       Navbar nằm ngoài vùng cuộn của UDashboardPanel nên không cần sticky/blur. -->
  <UDashboardNavbar
    :ui="{
      root: 'bg-default px-4 lg:px-6',
      left: 'min-w-0 gap-2',
      right: 'gap-1',
      toggle: 'size-9 justify-center text-muted hover:text-highlighted',
    }"
  >
    <template #title>
      <AppBreadcrumb />
    </template>
    <template #right>
      <!-- Dưới lg: locale + theme nằm trong UserMenu để header không vỡ hàng ở 375px -->
      <LanguageSwitcher class="hidden lg:block" />
      <ThemeSwitcher class="hidden lg:block" />
      <span aria-hidden="true" class="mx-1.5 hidden h-5 border-s border-default lg:block" />
      <UserMenu />
    </template>
  </UDashboardNavbar>
</template>
