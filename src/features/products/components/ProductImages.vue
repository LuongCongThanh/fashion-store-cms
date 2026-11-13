<script setup lang="ts">
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UIcon from '@nuxt/ui/components/Icon.vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { ColorGallery, ProductImage } from '@features/products/types/Product.types'

import ImageUploader from './ImageUploader.vue'

defineProps<{
  galleries: ColorGallery[]
  canWrite: boolean
  busy: boolean
  uploadState: (colorId: string) => { uploading: boolean; progress: number; error: string; canRetry: boolean }
}>()
const emit = defineEmits<{
  select: [colorId: string, file: File]
  cancel: [colorId: string]
  retry: [colorId: string]
  primary: [image: ProductImage]
  remove: [image: ProductImage]
}>()
const { t } = useT()
</script>

<template>
  <p v-if="!galleries.length" class="text-sm text-muted">{{ t('products.imagesNeedVariant') }}</p>
  <div v-else class="space-y-6">
    <section
      v-for="gallery in galleries"
      :key="gallery.color.id"
      class="space-y-3"
      :data-color="gallery.color.code"
      :aria-label="gallery.color.name"
    >
      <h3 class="flex items-center gap-2 text-sm font-medium text-highlighted">
        <span
          class="size-4 rounded border border-default"
          :style="{ backgroundColor: gallery.color.hex }"
          aria-hidden="true"
        />
        {{ gallery.color.name }}
        <span class="font-normal text-muted">({{ gallery.images.length }})</span>
      </h3>
      <ul v-if="gallery.images.length" class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <li
          v-for="image in gallery.images"
          :key="image.id"
          class="overflow-hidden rounded-lg border border-default"
          :data-image="image.id"
        >
          <div class="relative aspect-[3/4] bg-elevated">
            <img
              v-if="image.url"
              :src="image.url"
              :alt="image.altText ?? gallery.color.name"
              class="size-full object-cover"
              loading="lazy"
            />
            <UIcon v-else name="i-lucide-image-off" class="absolute inset-0 m-auto size-6 text-dimmed" />
            <UBadge v-if="image.isPrimary" size="sm" class="absolute top-1.5 left-1.5">{{
              t('media.mainImage')
            }}</UBadge>
          </div>
          <div v-if="canWrite" class="flex justify-between gap-1 p-1.5">
            <UButton
              v-if="!image.isPrimary"
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="busy"
              data-action="make-primary"
              @click="emit('primary', image)"
              >{{ t('media.main') }}</UButton
            >
            <span v-else />
            <UButton
              size="xs"
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              :disabled="busy"
              :aria-label="t('common.delete')"
              data-action="remove-image"
              @click="emit('remove', image)"
            />
          </div>
        </li>
      </ul>
      <ImageUploader
        v-if="canWrite"
        :uploading="uploadState(gallery.color.id).uploading"
        :progress="uploadState(gallery.color.id).progress"
        :error="uploadState(gallery.color.id).error"
        :canRetry="uploadState(gallery.color.id).canRetry"
        @select="emit('select', gallery.color.id, $event)"
        @cancel="emit('cancel', gallery.color.id)"
        @retry="emit('retry', gallery.color.id)"
      />
    </section>
  </div>
</template>
