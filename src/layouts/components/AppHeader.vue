<script setup lang="ts">
import StoreSwitcher from './StoreSwitcher.vue'
import UserMenu from './UserMenu.vue'
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b border-default px-6">
    <StoreSwitcher />
    <UserMenu />
  </header>
</template>
