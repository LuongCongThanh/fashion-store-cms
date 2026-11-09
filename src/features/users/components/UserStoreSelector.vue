<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'
const props = defineProps<{ options: { id: string; name: string }[]; modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const { t } = useT()
function toggle(id: string, checked: boolean) {
  emit(
    'update:modelValue',
    checked ? [...new Set([...props.modelValue, id])] : props.modelValue.filter((value) => value !== id),
  )
}
</script>

<template>
  <fieldset>
    <legend>{{ t('common.store') }}</legend>
    <label v-for="option in options" :key="option.id" class="mr-4">
      <input
        type="checkbox"
        :name="`store:${option.id}`"
        :checked="modelValue.includes(option.id)"
        @change="toggle(option.id, ($event.target as HTMLInputElement).checked)"
      />{{ option.name }}</label
    >
  </fieldset>
</template>
