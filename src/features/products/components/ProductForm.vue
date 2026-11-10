<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import { defineAsyncComponent } from 'vue'

import { CategorySelector } from '@features/categories/UseCategories'
import { ImageGallery, ImageUploader } from '@features/media/UseMediaComponents'
import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Category } from '@features/categories/types/Category.types'
import type { MediaImage } from '@features/media/types/Media.types'
import type { ProductInput } from '@features/products/schemas/Product.schema'

import ProductSeoFields from './ProductSeoFields.vue'
import ProductVariantTable from './ProductVariantTable.vue'
const props = defineProps<{
  modelValue: ProductInput
  errors: Record<string, string | undefined>
  pending: boolean
  categories: Category[]
  uploading: boolean
  uploadError: string
  uploadProgress: number
  canRetryUpload: boolean
  uploadedImage?: MediaImage
}>()
const emit = defineEmits<{
  'update:modelValue': [value: ProductInput]
  submit: [status: 'draft' | 'published']
  cancel: []
  upload: [file: File]
  uploadCancel: []
  uploadRetry: []
}>()
const { t } = useT()
function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
const DescriptionEditor = defineAsyncComponent(() => import('./ProductDescriptionEditor.vue'))
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit', 'published')">
    <FormSection :title="t('dashboard.products')">
      <UFormField :label="t('common.name')" name="name" :error="errors.name">
        <UInput
          name="name"
          :modelValue="modelValue.name"
          class="w-full"
          @update:modelValue="set('name', String($event))"
        />
      </UFormField>
      <UFormField :label="t('products.brand')" name="brand" :error="errors.brand">
        <UInput
          name="brand"
          :modelValue="modelValue.brand"
          class="w-full"
          @update:modelValue="set('brand', String($event))"
        />
      </UFormField>
      <DescriptionEditor :modelValue="modelValue.description" @update:modelValue="set('description', $event)" />
    </FormSection>
    <FormSection :title="t('products.price')">
      <div class="grid gap-4 sm:grid-cols-3">
        <UFormField
          v-for="key in ['price', 'comparePrice', 'cost'] as const"
          :key="key"
          :label="t(`products.${key}`)"
          :name="key"
          :error="errors[key]"
        >
          <UInputNumber
            :name="key"
            :data-field="key"
            :min="0"
            :stepSnapping="false"
            :formatOptions="{ maximumFractionDigits: 20 }"
            :modelValue="modelValue[key]"
            class="w-full"
            :ui="{ base: 'tabular-nums text-right' }"
            @update:modelValue="set(key, $event ?? 0)"
          />
        </UFormField>
      </div>
    </FormSection>
    <FormSection :title="t('products.category')">
      <CategorySelector
        :options="categories"
        :modelValue="modelValue.categoryIds"
        @update:modelValue="emit('update:modelValue', { ...modelValue, categoryIds: $event })"
      />
    </FormSection>
    <FormSection :title="t('media.upload')">
      <ImageUploader
        :uploading="uploading"
        :error="uploadError"
        :progress="uploadProgress"
        :canRetry="canRetryUpload"
        :image="uploadedImage"
        @cancel="emit('uploadCancel')"
        @retry="emit('uploadRetry')"
        @select="emit('upload', $event)"
      />
      <ImageGallery
        :images="modelValue.images"
        :mainId="modelValue.mainImageId"
        @remove="
          emit('update:modelValue', {
            ...modelValue,
            images: modelValue.images.filter((image) => image.id !== $event),
            mainImageId:
              modelValue.mainImageId === $event
                ? (modelValue.images.find((image) => image.id !== $event)?.id ?? '')
                : modelValue.mainImageId,
          })
        "
        @main="emit('update:modelValue', { ...modelValue, mainImageId: $event })"
        @move="
          (id, offset) => {
            const images = [...modelValue.images]
            const index = images.findIndex((image) => image.id === id)
            const target = index + offset
            if (images[index] && images[target]) {
              ;[images[index], images[target]] = [images[target]!, images[index]!]
              emit('update:modelValue', { ...modelValue, images })
            }
          }
        "
      />
    </FormSection>
    <FormSection :title="t('products.variant')">
      <ProductVariantTable
        :modelValue="modelValue.variants"
        :price="modelValue.price"
        :errors="errors"
        @update:modelValue="emit('update:modelValue', { ...modelValue, variants: $event })"
      />
    </FormSection>
    <FormSection :title="t('products.seo')">
      <ProductSeoFields
        :modelValue="modelValue"
        :errors="errors"
        @update:modelValue="emit('update:modelValue', $event)"
      />
    </FormSection>
    <FormActions draft :pending="pending || uploading" @cancel="emit('cancel')" @draft="emit('submit', 'draft')" />
  </form>
</template>
