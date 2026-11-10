<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import UTextarea from '@nuxt/ui/components/Textarea.vue'
import { computed } from 'vue'

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

/** reka-ui không cho option value rỗng, nên "Không có" dùng giá trị riêng và đổi về null khi emit. */
const NONE = '__none__'
const parents = computed(() => [
  { label: t('common.none'), value: NONE },
  ...props.categories.filter((item) => item.id !== props.id).map((item) => ({ label: item.name, value: item.id })),
])

function field(key: 'name' | 'slug' | 'metaTitle' | 'metaDescription', value: string | number | null | undefined) {
  emit('update:modelValue', { ...props.modelValue, [key]: String(value ?? '') })
}
function localized(lang: 'vi' | 'en', key: 'name' | 'description', value: string | number | null | undefined) {
  emit('update:modelValue', {
    ...props.modelValue,
    translations: {
      ...props.modelValue.translations,
      [lang]: { ...props.modelValue.translations[lang], [key]: String(value ?? '') },
    },
  })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('products.category')">
      <UFormField
        v-for="key in ['name', 'slug', 'metaTitle', 'metaDescription'] as const"
        :key="key"
        :label="t(`categories.${key}`)"
        :name="key"
        :error="errors[key]"
      >
        <UInput :name="key" :modelValue="modelValue[key]" class="w-full" @update:modelValue="field(key, $event)" />
        <template #error="{ error }">
          <span :data-error="key">{{ error }}</span>
        </template>
      </UFormField>
      <UFormField :label="t('categories.parent')" name="parentId" :error="errors.parentId">
        <USelect
          :modelValue="modelValue.parentId ?? NONE"
          :items="parents"
          class="w-full"
          @update:modelValue="
            emit('update:modelValue', { ...modelValue, parentId: $event === NONE ? null : String($event) })
          "
        />
        <template #error="{ error }">
          <span data-error="parentId">{{ error }}</span>
        </template>
      </UFormField>
    </FormSection>
    <FormSection v-for="lang in ['vi', 'en'] as const" :key="lang" :title="t(`common.language.${lang}`)">
      <UFormField :label="t('categories.name')" :name="`${lang}.name`">
        <UInput
          :name="`${lang}.name`"
          :modelValue="modelValue.translations[lang].name"
          class="w-full"
          @update:modelValue="localized(lang, 'name', $event)"
        />
      </UFormField>
      <UFormField :label="t('categories.description')" :name="`${lang}.description`">
        <UTextarea
          :name="`${lang}.description`"
          :modelValue="modelValue.translations[lang].description"
          :rows="3"
          autoresize
          class="w-full"
          @update:modelValue="localized(lang, 'description', $event)"
        />
      </UFormField>
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
