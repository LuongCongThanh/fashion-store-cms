<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import USlideover from '@nuxt/ui/components/Slideover.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useT } from '@shared/lib/i18n/I18n'

import SidebarNav from './SidebarNav.vue'

const { t } = useT()
const route = useRoute()
const open = ref(false)

// Chọn link trong drawer → đổi route → đóng drawer để thấy trang mới.
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
</script>

<template>
  <USlideover v-model:open="open" side="left" :title="t('common.appName')" :description="t('nav.menu')">
    <UButton icon="i-lucide-menu" color="neutral" variant="ghost" class="lg:hidden" :aria-label="t('nav.openMenu')" />
    <template #body>
      <SidebarNav />
    </template>
  </USlideover>
</template>
