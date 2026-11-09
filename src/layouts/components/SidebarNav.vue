<script setup lang="ts">
import UNavigationMenu from '@nuxt/ui/components/NavigationMenu.vue'
import { computed } from 'vue'

import { useNavigation } from '@layouts/Navigation'
import { useT } from '@shared/lib/i18n/I18n'

import type { MessageKey } from '@shared/lib/i18n/I18n'

defineProps<{ collapsed?: boolean }>()

const { t } = useT()
const navigation = useNavigation()

// Chỉ render kết quả của Navigation, không tự đọc route meta (§V.3).
const groups = computed(() =>
  navigation.value.sidebarGroups.map((group) => ({
    title: group.titleKey ? t(group.titleKey as MessageKey) : null,
    items: group.items.map((item) => ({
      label: t(item.titleKey as MessageKey),
      icon: item.icon,
      to: item.path,
    })),
  })),
)
</script>

<template>
  <div v-for="(group, index) in groups" :key="index" class="py-2">
    <p v-if="group.title && !collapsed" class="px-4 text-xs font-semibold text-muted">
      {{ group.title }}
    </p>
    <UNavigationMenu :items="group.items" orientation="vertical" :collapsed="collapsed" class="px-2" />
  </div>
</template>
