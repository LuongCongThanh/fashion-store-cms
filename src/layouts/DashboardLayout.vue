<script setup lang="ts">
import UserMenu from './components/UserMenu.vue'
</script>

<template>
  <div class="bg-default text-default min-h-screen">
    <header class="border-default flex h-14 items-center justify-end border-b px-6">
      <UserMenu />
    </header>
    <main class="mx-auto max-w-screen-2xl p-4 lg:p-6">
      <slot />
    </main>
  </div>
</template>
