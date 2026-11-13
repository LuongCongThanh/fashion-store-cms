<script setup lang="ts">
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
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
  slug?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: CategoryInput]; submit: []; cancel: [] }>()
const { t } = useT()

/** reka-ui không cho option value rỗng, nên "Không có" dùng giá trị riêng và đổi về null khi emit. */
const NONE = '__none__'
const parents = computed(() => [
  { label: t('common.none'), value: NONE },
  ...props.categories.map((item) => ({ label: item.name, value: item.id })),
])

function update<K extends keyof CategoryInput>(key: K, value: CategoryInput[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('products.category')">
      <UFormField :label="t('categories.name')" name="name" :error="errors.name" :hint="slug ? `/${slug}` : undefined">
        <UInput
          name="name"
          :modelValue="modelValue.name"
          class="w-full"
          @update:modelValue="update('name', String($event ?? ''))"
        />
        <template #error="{ error }">
          <span data-error="name">{{ error }}</span>
        </template>
      </UFormField>
      <UFormField :label="t('categories.description')" name="description" :error="errors.description">
        <UTextarea
          name="description"
          :modelValue="modelValue.description"
          :rows="3"
          autoresize
          class="w-full"
          @update:modelValue="update('description', String($event ?? ''))"
        />
      </UFormField>
      <UFormField :label="t('categories.parent')" name="parentId" :error="errors.parentId">
        <USelect
          :modelValue="modelValue.parentId ?? NONE"
          :items="parents"
          class="w-full"
          @update:modelValue="update('parentId', $event === NONE ? null : String($event))"
        />
        <template #error="{ error }">
          <span data-error="parentId">{{ error }}</span>
        </template>
      </UFormField>
      <UFormField :label="t('categories.sortOrder')" name="sortOrder" :error="errors.sortOrder">
        <UInputNumber
          name="sortOrder"
          :modelValue="modelValue.sortOrder"
          :min="0"
          @update:modelValue="update('sortOrder', Number($event ?? 0))"
        />
      </UFormField>
      <UCheckbox
        name="isVisible"
        :label="t('categories.isVisible')"
        :modelValue="modelValue.isVisible"
        @update:modelValue="update('isVisible', $event === true)"
      />
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
