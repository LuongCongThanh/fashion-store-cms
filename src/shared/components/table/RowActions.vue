<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue'
import { computed } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'
const props = defineProps<{ actions: { id: string; label: string; allowed: boolean }[]; label?: string }>()
const emit = defineEmits<{ action: [id: string] }>()
const { t } = useT()
const items = computed(() =>
  props.actions
    .filter((action) => action.allowed)
    .map((action) => ({
      label: action.label,
      onSelect: () => {
        emit('action', action.id)
      },
    })),
)
</script>

<template>
  <UDropdownMenu v-if="items.length" :items="items"
    ><UButton
      data-action="row-actions"
      icon="i-lucide-ellipsis"
      :aria-label="label ?? t('common.actions')"
      variant="ghost"
  /></UDropdownMenu>
</template>
