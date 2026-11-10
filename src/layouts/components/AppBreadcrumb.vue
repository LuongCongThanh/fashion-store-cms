<script setup lang="ts">
import UIcon from '@nuxt/ui/components/Icon.vue'
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
  <nav aria-label="Breadcrumb" class="flex min-w-0 items-center gap-1.5 text-sm">
    <template v-for="(item, index) in items" :key="item.path">
      <UIcon
        v-if="index"
        name="i-lucide-chevron-right"
        aria-hidden="true"
        class="hidden size-4 shrink-0 text-dimmed sm:inline-block"
      />
      <RouterLink
        v-if="index < items.length - 1"
        :to="item.path"
        class="hidden rounded-md px-1.5 py-1 text-muted transition-colors hover:bg-elevated hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary sm:inline"
        >{{ t(item.titleKey as MessageKey) }}</RouterLink
      >
      <span v-else aria-current="page" class="truncate px-1.5 py-1 font-semibold text-highlighted">{{
        t(item.titleKey as MessageKey)
      }}</span>
    </template>
  </nav>
</template>
