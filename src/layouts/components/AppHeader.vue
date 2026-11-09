<script setup lang="ts">
import AppBreadcrumb from './AppBreadcrumb.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import MobileNavDrawer from './MobileNavDrawer.vue'
import StoreSwitcher from './StoreSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import UserMenu from './UserMenu.vue'
</script>

<template>
  <header class="flex h-14 items-center justify-between gap-2 border-b border-default px-4 lg:px-6">
    <div class="flex min-w-0 items-center gap-2 lg:gap-4">
      <MobileNavDrawer />
      <StoreSwitcher />
      <AppBreadcrumb />
    </div>
    <div class="flex shrink-0 items-center gap-3">
      <!-- Dưới lg: locale + theme nằm trong UserMenu để header không vỡ hàng ở 375px -->
      <LanguageSwitcher class="hidden lg:block" />
      <ThemeSwitcher class="hidden lg:block" />
      <UserMenu />
    </div>
  </header>
</template>
