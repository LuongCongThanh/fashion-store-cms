<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ from?: string; to?: string }>()
const emit = defineEmits<{ filter: [key: string, value: string] }>()
const { t } = useT()
</script>

<template>
  <label
    >{{ t('common.from')
    }}<input
      name="from"
      type="date"
      :value="from"
      :max="to"
      @change="emit('filter', 'from', ($event.target as HTMLInputElement).value)" /></label
  ><label
    >{{ t('common.to')
    }}<input
      name="to"
      type="date"
      :value="to"
      :min="from"
      @change="emit('filter', 'to', ($event.target as HTMLInputElement).value)"
  /></label>
</template>
