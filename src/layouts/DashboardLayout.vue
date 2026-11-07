<script setup lang="ts">
import StoreSwitcher from './components/StoreSwitcher.vue'
import UserMenu from './components/UserMenu.vue'
</script>

<template>
  <div class="bg-default text-default min-h-screen">
    <header class="border-default flex h-14 items-center justify-between border-b px-6">
      <StoreSwitcher />
      <UserMenu />
    </header>
    <main class="mx-auto max-w-screen-2xl p-4 lg:p-6">
      <RouterView />
    </main>
  </div>
</template>
