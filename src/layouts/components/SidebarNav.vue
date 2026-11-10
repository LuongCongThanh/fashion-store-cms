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
  <section v-for="(group, index) in groups" :key="index" class="px-2 py-1.5">
    <p
      v-if="group.title && !collapsed"
      class="mb-1.5 px-3 pt-2 text-[10px] font-semibold tracking-[0.14em] text-muted uppercase"
    >
      {{ group.title }}
    </p>
    <div v-else-if="index" aria-hidden="true" class="mx-3 my-2 h-px bg-(--ui-border)" />
    <UNavigationMenu
      :items="group.items"
      orientation="vertical"
      :collapsed="collapsed"
      tooltip
      :ui="{
        list: 'gap-1',
        link: 'min-h-10 cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-muted before:rounded-md hover:text-highlighted hover:before:bg-elevated data-active:text-primary data-active:before:bg-default data-active:before:ring-1 data-active:before:ring-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        linkLeadingIcon: 'size-[18px] text-dimmed group-data-active:text-primary',
      }"
    />
  </section>
</template>
