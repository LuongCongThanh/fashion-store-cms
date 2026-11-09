<script setup lang="ts">
import AppBreadcrumb from './AppBreadcrumb.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import StoreSwitcher from './StoreSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import UserMenu from './UserMenu.vue'
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b border-default px-6">
    <div class="flex items-center gap-4"><StoreSwitcher /><AppBreadcrumb /></div>
    <div class="flex items-center gap-3"><LanguageSwitcher /><ThemeSwitcher /><UserMenu /></div>
  </header>
</template>
