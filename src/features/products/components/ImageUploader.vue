<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UIcon from '@nuxt/ui/components/Icon.vue'
import UProgress from '@nuxt/ui/components/Progress.vue'
import { onBeforeUnmount, ref, useId } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'

defineProps<{
  uploading: boolean
  error?: string
  progress?: number
  canRetry?: boolean
}>()
const emit = defineEmits<{ select: [file: File]; cancel: []; retry: [] }>()
const { t } = useT()
const preview = ref('')
const errorId = `${useId()}-upload-error`
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
    <!--
      Giữ input file native (ẩn) để dùng hộp chọn file của trình duyệt; vùng chọn là label có style,
      focus ring đi theo input qua `has-[:focus-visible]`.
    -->
    <UFormField :error="error">
      <label
        class="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-default bg-elevated/50 p-4 transition-colors duration-150 hover:border-primary has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-75 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary motion-reduce:transition-none"
      >
        <img
          v-if="preview"
          :src="preview"
          :alt="t('media.preview')"
          class="size-20 shrink-0 rounded-md border border-default object-cover"
        />
        <span
          v-else
          class="flex size-20 shrink-0 items-center justify-center rounded-md border border-dashed border-default bg-elevated"
          aria-hidden="true"
        >
          <UIcon name="i-lucide-image-plus" class="size-6 text-dimmed" />
        </span>
        <span class="space-y-1 text-sm">
          <span class="block font-medium text-highlighted">{{ t('media.upload') }}</span>
          <span class="block text-xs text-muted">{{ t('media.hint') }}</span>
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="sr-only"
          :aria-describedby="error ? errorId : undefined"
          :aria-invalid="error ? true : undefined"
          :disabled="uploading"
          @change="select"
        />
      </label>
      <template v-if="error" #error>
        <span :id="errorId">{{ error }}</span>
      </template>
    </UFormField>
    <div v-if="uploading" class="flex items-center gap-3">
      <UProgress :modelValue="progress" :max="100" size="sm" class="flex-1" :aria-label="t('media.uploading')" />
      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        size="xs"
        data-action="cancel-upload"
        @click="emit('cancel')"
        >{{ t('common.cancel') }}</UButton
      >
    </div>
    <UButton
      v-if="canRetry && !uploading"
      type="button"
      color="neutral"
      variant="outline"
      size="sm"
      data-action="retry-upload"
      @click="emit('retry')"
      >{{ t('common.retry') }}</UButton
    >
  </div>
</template>
