<script setup lang="ts">
import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { CategoryInput } from '@features/categories/schemas/Category.schema'
import type { Category } from '@features/categories/types/Category.types'
const props = defineProps<{
  modelValue: CategoryInput
  errors: Record<string, string | undefined>
  pending: boolean
  categories: Category[]
  id?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: CategoryInput]; submit: []; cancel: [] }>()
const { t } = useT()
function field(key: 'name' | 'slug' | 'metaTitle' | 'metaDescription', event: Event) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: (event.target as HTMLInputElement).value,
  })
}
function localized(lang: 'vi' | 'en', key: 'name' | 'description', event: Event) {
  emit('update:modelValue', {
    ...props.modelValue,
    translations: {
      ...props.modelValue.translations,
      [lang]: {
        ...props.modelValue.translations[lang],
        [key]: (event.target as HTMLInputElement).value,
      },
    },
  })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('products.category')">
      <label v-for="key in ['name', 'slug', 'metaTitle', 'metaDescription'] as const" :key="key" class="block"
        >{{ t(`categories.${key}`)
        }}<input
          :name="key"
          :value="modelValue[key]"
          class="block w-full rounded border border-default bg-default p-2"
          @input="field(key, $event)"
        />
        <span v-if="errors[key]" :data-error="key" role="alert">{{ errors[key] }}</span>
      </label>
      <label
        >{{ t('categories.parent')
        }}<select
          name="parentId"
          :value="modelValue.parentId ?? ''"
          @change="
            emit('update:modelValue', {
              ...modelValue,
              parentId: ($event.target as HTMLSelectElement).value || null,
            })
          "
        >
          <option value="">{{ t('common.none') }}</option>
          <option
            v-for="category in categories.filter((item) => item.id !== id)"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <span v-if="errors.parentId" data-error="parentId" role="alert">{{ errors.parentId }}</span>
      </label>
    </FormSection>
    <FormSection v-for="lang in ['vi', 'en'] as const" :key="lang" :title="t(`common.language.${lang}`)">
      <label v-for="key in ['name', 'description'] as const" :key="key" class="block"
        >{{ t(`categories.${key}`)
        }}<input
          :name="`${lang}.${key}`"
          :value="modelValue.translations[lang][key]"
          class="block w-full rounded border border-default bg-default p-2"
          @input="localized(lang, key, $event)"
        />
      </label>
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
