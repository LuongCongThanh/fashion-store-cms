<script setup lang="ts">
import UDashboardNavbar from '@nuxt/ui/components/DashboardNavbar.vue'
import UDashboardSearchButton from '@nuxt/ui/components/DashboardSearchButton.vue'

import { useT } from '@shared/lib/i18n/I18n'

import AppBreadcrumb from './AppBreadcrumb.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import UserMenu from './UserMenu.vue'
const { t } = useT()
</script>

<template>
  <!-- Toggle sidebar (dưới lg) do UDashboardNavbar render sẵn; tiêu đề trang nằm ở PageHeader, không lặp ở đây -->
  <UDashboardNavbar :ui="{ root: 'px-4 lg:px-6', left: 'min-w-0' }">
    <template #title>
      <AppBreadcrumb />
    </template>
    <template #right>
      <UDashboardSearchButton class="hidden sm:inline-flex" :label="t('common.search')" />
      <!-- Dưới lg: locale + theme nằm trong UserMenu để header không vỡ hàng ở 375px -->
      <LanguageSwitcher class="hidden lg:block" />
      <ThemeSwitcher class="hidden lg:block" />
      <UserMenu />
    </template>
  </UDashboardNavbar>
</template>
