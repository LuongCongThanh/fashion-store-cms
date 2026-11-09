<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'

import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ from?: string; to?: string }>()
const emit = defineEmits<{ filter: [key: string, value: string] }>()
const { t } = useT()
</script>

<template>
  <UFormField :label="t('common.from')" name="from" size="sm">
    <UInput
      name="from"
      type="date"
      :modelValue="from"
      :max="to"
      @change="emit('filter', 'from', ($event.target as HTMLInputElement).value)"
    />
  </UFormField>
  <UFormField :label="t('common.to')" name="to" size="sm">
    <UInput
      name="to"
      type="date"
      :modelValue="to"
      :min="from"
      @change="emit('filter', 'to', ($event.target as HTMLInputElement).value)"
    />
  </UFormField>
</template>
