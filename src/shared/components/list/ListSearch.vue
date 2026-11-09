<script setup lang="ts">
import UInput from '@nuxt/ui/components/Input.vue'

import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ modelValue?: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { t } = useT()
</script>

<template>
  <UInput
    name="search"
    :modelValue="modelValue"
    :placeholder="t('common.search')"
    :aria-label="t('common.search')"
    icon="i-lucide-search"
    :size="size"
    @update:modelValue="emit('update:modelValue', String($event))"
  />
</template>
