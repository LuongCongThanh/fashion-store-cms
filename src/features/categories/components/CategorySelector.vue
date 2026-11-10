<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import USelectMenu from '@nuxt/ui/components/SelectMenu.vue'
import { computed } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { Category } from '@features/categories/types/Category.types'
const props = defineProps<{ options: Category[]; modelValue: string[]; exclude?: string }>()
const emit = defineEmits<{ 'update:modelValue': [ids: string[]] }>()
const { t } = useT()
const items = computed(() =>
  props.options.filter((item) => item.id !== props.exclude).map((item) => ({ label: item.name, value: item.id })),
)
</script>

<template>
  <UFormField :label="t('products.category')" name="categoryIds">
    <USelectMenu
      multiple
      valueKey="value"
      :modelValue="modelValue"
      :items="items"
      class="w-full"
      @update:modelValue="emit('update:modelValue', ($event ?? []) as string[])"
    />
  </UFormField>
</template>
