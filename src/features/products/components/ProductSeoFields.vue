<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { ProductInput } from '@features/products/schemas/Product.schema'
const props = defineProps<{ modelValue: ProductInput; errors: Record<string, string | undefined> }>()
const emit = defineEmits<{ 'update:modelValue': [value: ProductInput] }>()
const { t } = useT()
</script>

<template>
  <div class="space-y-4">
    <UFormField
      v-for="key in ['slug', 'metaTitle', 'metaDescription'] as const"
      :key="key"
      :label="t(`categories.${key}`)"
      :name="key"
      :error="errors[key]"
    >
      <UInput
        :name="key"
        :modelValue="modelValue[key]"
        class="w-full"
        @update:modelValue="emit('update:modelValue', { ...props.modelValue, [key]: String($event) })"
      />
      <template #error="{ error }">
        <span :data-error="key">{{ error }}</span>
      </template>
    </UFormField>
  </div>
</template>
