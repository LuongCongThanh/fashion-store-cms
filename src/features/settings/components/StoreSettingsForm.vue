<script setup lang="ts">
import { ImageUploader } from '@features/media/UseMediaComponents'
import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { StoreSettingsInput } from '@features/settings/schemas/Settings.schema'
defineProps<{
  modelValue: StoreSettingsInput
  errors: Record<string, string | undefined>
  pending: boolean
  canWrite: boolean
  uploading: boolean
  uploadError: string
  uploadProgress: number
  canRetryUpload: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value: StoreSettingsInput]
  upload: [file: File]
  uploadCancel: []
  uploadRetry: []
  submit: []
  cancel: []
}>()
const { t } = useT()
</script>

<template>
  <form class="space-y-5" @submit.prevent="emit('submit')">
    <fieldset :disabled="!canWrite || pending">
      <FormSection :title="t('settings.store')">
        <label
          v-for="key in ['name', 'description', 'contactEmail', 'phone', 'address'] as const"
          :key="key"
          class="block"
          >{{ t(`settings.${key}`)
          }}<input
            :name="key"
            :type="key === 'contactEmail' ? 'email' : 'text'"
            :value="modelValue[key]"
            class="block w-full rounded border border-default bg-default p-2"
            @input="
              emit('update:modelValue', {
                ...modelValue,
                [key]: ($event.target as HTMLInputElement).value,
              })
            "
          />
          <span v-if="errors[key]" role="alert">{{ errors[key] }}</span>
        </label>
        <ImageUploader
          :uploading="uploading"
          :error="uploadError"
          :progress="uploadProgress"
          :canRetry="canRetryUpload"
          :image="modelValue.logo ?? undefined"
          @cancel="emit('uploadCancel')"
          @retry="emit('uploadRetry')"
          @select="emit('upload', $event)"
        />
      </FormSection>
    </fieldset>
    <FormActions v-if="canWrite" :pending="pending || uploading" @cancel="emit('cancel')" />
  </form>
</template>
