<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { onBeforeUnmount, ref } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { MediaImage } from '../types/Media.types'
defineProps<{
  uploading: boolean
  error?: string
  image?: MediaImage
  progress?: number
  canRetry?: boolean
}>()
const emit = defineEmits<{ select: [file: File]; cancel: []; retry: [] }>()
const { t } = useT()
const preview = ref('')
function select(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = ''
  if (
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) &&
    file.size <= 5 * 1024 * 1024 &&
    typeof URL.createObjectURL === 'function'
  )
    preview.value = URL.createObjectURL(file)
  emit('select', file)
  ;(event.target as HTMLInputElement).value = ''
}
onBeforeUnmount(() => {
  if (preview.value) URL.revokeObjectURL(preview.value)
})
</script>
<template>
  <div class="space-y-3">
    <label
      >{{ t('media.upload')
      }}<input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        :disabled="uploading"
        @change="select"
      />
    </label>
    <p v-if="error" role="alert">{{ error }}</p>
    <UButton v-if="uploading" type="button" data-action="cancel-upload" @click="emit('cancel')">{{
      t('common.cancel')
    }}</UButton>
    <UButton
      v-if="canRetry && !uploading"
      type="button"
      data-action="retry-upload"
      @click="emit('retry')"
      >{{ t('common.retry') }}</UButton
    >
    <progress v-if="uploading" :value="progress" max="100" :aria-label="t('media.uploading')" />
    <img
      v-if="image || preview"
      :src="image?.url ?? preview"
      :alt="image?.name ?? t('media.preview')"
      class="h-32 w-32 rounded object-cover"
    />
  </div>
</template>
