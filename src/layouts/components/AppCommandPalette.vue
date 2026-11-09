<script setup lang="ts">
import UDashboardSearch from '@nuxt/ui/components/DashboardSearch.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useNavigation } from '@layouts/Navigation'
import { useT } from '@shared/lib/i18n/I18n'

import type { MessageKey } from '@shared/lib/i18n/I18n'

const router = useRouter()
const navigation = useNavigation()
const { t } = useT()
const groups = computed(() =>
  (['navigate', 'create'] as const).map((group) => ({
    id: group,
    label: group === 'navigate' ? t('common.navigate') : t('common.create'),
    items: navigation.value.commands
      .filter((command) => command.group === group)
      .map((command) => ({
        label: t(command.titleKey as MessageKey),
        icon: command.icon,
        onSelect: () => router.push(command.path),
      })),
  })).filter((group) => group.items.length),
)
</script>

<template>
  <UDashboardSearch :groups="groups" :colorMode="false" shortcut="meta_k" />
</template>
