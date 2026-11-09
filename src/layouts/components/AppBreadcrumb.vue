<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useNavigation } from '@layouts/Navigation'
import { useT } from '@shared/lib/i18n/I18n'

import type { MessageKey } from '@shared/lib/i18n/I18n'
const route = useRoute()
const navigation = useNavigation()
const { t } = useT()
const items = computed(() => navigation.value.breadcrumbs(route))
</script>

<template>
  <!-- eslint-disable-next-line vue/no-bare-strings-in-template -- landmark label, selector của test -->
  <nav aria-label="Breadcrumb" class="flex min-w-0 gap-2 text-sm">
    <template v-for="(item, index) in items" :key="item.path">
      <span v-if="index" aria-hidden="true" class="hidden sm:inline">/</span>
      <RouterLink v-if="index < items.length - 1" :to="item.path" class="hidden sm:inline">{{
        t(item.titleKey as MessageKey)
      }}</RouterLink>
      <span v-else aria-current="page" class="truncate">{{ t(item.titleKey as MessageKey) }}</span>
    </template>
  </nav>
</template>
