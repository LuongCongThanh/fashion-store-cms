<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, useTemplateRef, watch } from 'vue'

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
const DescriptionEditor = defineAsyncComponent(() => import('./ProductDescriptionEditor.vue'))
const form = useTemplateRef<HTMLFormElement>('form')
const errorEntries = computed(() => Object.entries(props.errors).filter((entry): entry is [string, string] => !!entry[1]))
const fieldLabel = (key: string) => {
  if (key === 'price') return t('products.price')
  if (key === 'slug') return 'Slug'
  if (key === 'name') return t('common.name')
  if (key.includes('.sku')) return 'SKU'
  return key
}
watch(
  () => props.errors,
  async () => {
    if (!errorEntries.value.length) return
    await nextTick()
    const firstError = errorEntries.value[0]
    if (!firstError) return
    const name = CSS.escape(firstError[0])
    form.value?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus()
  },
  { deep: true },
)
</script>

<template>
  <form ref="form" class="space-y-6" @submit.prevent="emit('submit', 'published')">
    <nav class="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-default bg-default py-2" :aria-label="t('common.sections')">
      <a v-for="section in [['basic', t('dashboard.products')], ['pricing', t('products.price')], ['categories', t('products.category')], ['images', t('media.upload')], ['variants', t('products.variant')], ['seo', t('products.seo')]]" :key="section[0]" :href="`#product-${section[0]}`" class="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{{ section[1] }}</a>
    </nav>
    <div v-if="errorEntries.length" role="alert" data-validation-summary class="rounded-lg border border-error p-4" tabindex="-1">
      <p class="font-semibold text-highlighted">{{ t('common.validationErrors') }}</p>
      <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
        <li v-for="([key, message]) in errorEntries" :key="key">{{ fieldLabel(key) }}: {{ message }}</li>
      </ul>
    </div>
    <FormSection id="product-basic" :title="t('dashboard.products')">
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
    <FormSection id="product-pricing" :title="t('products.price')">
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
    <FormSection id="product-categories" :title="t('products.category')">
      <CategorySelector
        :options="categories"
        :modelValue="modelValue.categoryIds"
        @update:modelValue="emit('update:modelValue', { ...modelValue, categoryIds: $event })"
      />
    </FormSection>
    <FormSection id="product-images" :title="t('media.upload')">
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
    <FormSection id="product-variants" :title="t('products.variant')">
      <ProductVariantTable
        :modelValue="modelValue.variants"
        :price="modelValue.price"
        :errors="errors"
        @update:modelValue="emit('update:modelValue', { ...modelValue, variants: $event })"
      />
    </FormSection>
    <FormSection id="product-seo" :title="t('products.seo')">
      <ProductSeoFields
        :modelValue="modelValue"
        :errors="errors"
        @update:modelValue="emit('update:modelValue', $event)"
      />
    </FormSection>
    <FormActions draft :pending="pending || uploading" @cancel="emit('cancel')" @draft="emit('submit', 'draft')" />
  </form>
</template>
