<script setup lang="ts">
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'

import { useT } from '@shared/lib/i18n/I18n'
const props = defineProps<{ options: { id: string; name: string }[]; modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const { t } = useT()
function toggle(id: string, checked: boolean | 'indeterminate') {
  emit(
    'update:modelValue',
    checked === true ? [...new Set([...props.modelValue, id])] : props.modelValue.filter((value) => value !== id),
  )
}
</script>

<template>
  <fieldset class="space-y-2">
    <legend class="text-sm font-medium text-default">{{ t('roles.title') }}</legend>
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <UCheckbox
        v-for="option in options"
        :id="`role:${option.id}`"
        :key="option.id"
        :label="option.name"
        :modelValue="modelValue.includes(option.id)"
        @update:modelValue="toggle(option.id, $event)"
      />
    </div>
  </fieldset>
</template>
