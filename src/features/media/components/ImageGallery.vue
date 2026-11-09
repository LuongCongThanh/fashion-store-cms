<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { MediaImage } from '@features/media/types/Media.types'
defineProps<{ images: MediaImage[]; mainId?: string }>()
const emit = defineEmits<{
  remove: [id: string]
  main: [id: string]
  move: [id: string, offset: number]
}>()
const { t } = useT()
</script>
<template>
  <ul class="flex flex-wrap gap-4">
    <li v-for="(image, index) in images" :key="image.id" class="space-y-2">
      <img :src="image.url" :alt="image.name" class="h-28 w-28 object-cover" />
      <UButton :disabled="mainId === image.id" @click="emit('main', image.id)">{{ t('media.main') }}</UButton>
      <UButton
        :disabled="index === 0"
        :aria-label="t('media.moveLeft')"
        icon="i-lucide-arrow-left"
        @click="emit('move', image.id, -1)"
      />
      <UButton
        :disabled="index === images.length - 1"
        :aria-label="t('media.moveRight')"
        icon="i-lucide-arrow-right"
        @click="emit('move', image.id, 1)"
      />
      <UButton color="error" @click="emit('remove', image.id)">{{ t('common.delete') }}</UButton>
    </li>
  </ul>
</template>
