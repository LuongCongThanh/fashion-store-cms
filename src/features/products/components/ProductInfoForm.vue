<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import UTextarea from '@nuxt/ui/components/Textarea.vue'
import { computed } from 'vue'

import { PRODUCT_GENDERS, type ProductGender } from '@features/products/types/Product.types'
import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Category } from '@features/categories/types/Category.types'
import type { ProductInfoInput } from '@features/products/schemas/Product.schema'

const props = defineProps<{
  modelValue: ProductInfoInput
  errors: Record<string, string | undefined>
  pending: boolean
  categories: Category[]
  readOnly?: boolean
  slug?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: ProductInfoInput]; submit: []; cancel: [] }>()
const { t } = useT()
const genderItems = computed(() => PRODUCT_GENDERS.map((value) => ({ label: t(`products.genders.${value}`), value })))
const categoryItems = computed(() => props.categories.map((category) => ({ label: category.name, value: category.id })))
function update<K extends keyof ProductInfoInput>(key: K, value: ProductInfoInput[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('products.info')">
      <UFormField :label="t('common.name')" name="name" :error="errors.name" :hint="slug ? `/${slug}` : undefined">
        <UInput
          name="name"
          :modelValue="modelValue.name"
          :disabled="readOnly"
          class="w-full"
          @update:modelValue="update('name', String($event ?? ''))"
        />
        <template #error="{ error }">
          <span data-error="name">{{ error }}</span>
        </template>
      </UFormField>
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField :label="t('products.category')" name="categoryId" :error="errors.categoryId">
          <USelect
            :modelValue="modelValue.categoryId || undefined"
            :items="categoryItems"
            :placeholder="t('products.chooseCategory')"
            :disabled="readOnly"
            class="w-full"
            @update:modelValue="update('categoryId', String($event ?? ''))"
          />
          <template #error="{ error }">
            <span data-error="categoryId">{{ error }}</span>
          </template>
        </UFormField>
        <UFormField
          :label="t('products.weightGrams')"
          name="weightGrams"
          :error="errors.weightGrams"
          :hint="t('products.weightHint')"
        >
          <UInputNumber
            name="weightGrams"
            data-field="weightGrams"
            :modelValue="modelValue.weightGrams"
            :min="1"
            :disabled="readOnly"
            class="w-full"
            @update:modelValue="update('weightGrams', Number($event ?? 0))"
          />
          <template #error="{ error }">
            <span data-error="weightGrams">{{ error }}</span>
          </template>
        </UFormField>
        <UFormField :label="t('products.gender')" name="gender" :error="errors.gender">
          <USelect
            data-field="gender"
            :modelValue="modelValue.gender"
            :items="genderItems"
            :disabled="readOnly"
            class="w-full"
            @update:modelValue="update('gender', $event as ProductGender)"
          />
        </UFormField>
      </div>
      <UFormField :label="t('products.description')" name="description" :error="errors.description">
        <UTextarea
          name="description"
          :modelValue="modelValue.description"
          :rows="4"
          autoresize
          :maxlength="5000"
          :disabled="readOnly"
          class="w-full"
          @update:modelValue="update('description', String($event ?? ''))"
        />
      </UFormField>
    </FormSection>
    <FormActions v-if="!readOnly" :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
