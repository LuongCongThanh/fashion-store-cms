<script setup lang="ts">
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
defineProps<{
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
const DescriptionEditor = defineAsyncComponent(() => import('./ProductDescriptionEditor.vue'))
</script>
<template>
  <form class="space-y-5" @submit.prevent="emit('submit', 'published')">
    <FormSection :title="t('dashboard.products')">
      <label
        >{{ t('common.name')
        }}<input
          name="name"
          :value="modelValue.name"
          class="block w-full rounded border border-default bg-default p-2"
          @input="
            emit('update:modelValue', {
              ...modelValue,
              name: ($event.target as HTMLInputElement).value,
            })
          "
        />
      </label>
      <p v-if="errors.name" role="alert">{{ errors.name }}</p>
      <label
        >{{ t('products.brand')
        }}<input
          name="brand"
          :value="modelValue.brand"
          @input="
            emit('update:modelValue', {
              ...modelValue,
              brand: ($event.target as HTMLInputElement).value,
            })
          "
        />
      </label>
      <DescriptionEditor
        :modelValue="modelValue.description"
        @update:modelValue="emit('update:modelValue', { ...modelValue, description: $event })"
      />
    </FormSection>
    <FormSection :title="t('products.price')">
      <label v-for="key in ['price', 'comparePrice', 'cost'] as const" :key="key"
        >{{ t(`products.${key}`)
        }}<input
          :name="key"
          type="number"
          min="0"
          :value="modelValue[key]"
          @input="
            emit('update:modelValue', {
              ...modelValue,
              [key]: Number(($event.target as HTMLInputElement).value),
            })
          "
        />
        <span v-if="errors[key]" role="alert">{{ errors[key] }}</span>
      </label>
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
