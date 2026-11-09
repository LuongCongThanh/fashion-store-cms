<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'

import type { ProductInput } from '@features/products/schemas/Product.schema'
defineProps<{ modelValue: ProductInput; errors: Record<string, string | undefined> }>()
const emit = defineEmits<{ 'update:modelValue': [value: ProductInput] }>()
const { t } = useT()
</script>
<template>
  <div>
    <label v-for="key in ['slug', 'metaTitle', 'metaDescription'] as const" :key="key" class="block"
      >{{ t(`categories.${key}`)
      }}<input
        :name="key"
        :value="modelValue[key]"
        class="block w-full rounded border border-default bg-default p-2"
        @input="
          emit('update:modelValue', {
            ...modelValue,
            [key]: ($event.target as HTMLInputElement).value,
          })
        "
      />
      <span v-if="errors[key]" :data-error="key" role="alert">{{ errors[key] }}</span>
    </label>
  </div>
</template>
