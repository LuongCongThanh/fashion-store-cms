<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'

import type { Category } from '../types/Category.types'
defineProps<{ options: Category[]; modelValue: string[]; exclude?: string }>()
const emit = defineEmits<{ 'update:modelValue': [ids: string[]] }>()
const { t } = useT()
</script>
<template>
  <label
    >{{ t('products.category')
    }}<select
      multiple
      name="categoryIds"
      :value="modelValue"
      @change="
        emit(
          'update:modelValue',
          Array.from(
            ($event.target as HTMLSelectElement).selectedOptions,
            (option) => option.value,
          ),
        )
      "
    >
      <option
        v-for="category in options.filter((item) => item.id !== exclude)"
        :key="category.id"
        :value="category.id"
      >
        {{ category.name }}
      </option>
    </select>
  </label>
</template>
