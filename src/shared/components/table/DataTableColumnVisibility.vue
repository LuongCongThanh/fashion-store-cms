<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ columns: { id: string; label: string }[]; modelValue: Record<string, boolean> }>()
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, boolean>] }>()
const { t } = useT()
</script>

<template>
  <details>
    <summary>{{ t('common.columns') }}</summary>
    <label v-for="column in columns" :key="column.id" class="mr-3"
      ><input
        type="checkbox"
        :checked="modelValue[column.id] !== false"
        @change="
          emit('update:modelValue', {
            ...modelValue,
            [column.id]: ($event.target as HTMLInputElement).checked,
          })
        "
      />{{ column.label }}</label
    >
  </details>
</template>
