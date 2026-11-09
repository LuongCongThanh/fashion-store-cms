<script setup lang="ts">
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'

import StoreSettingsForm from '../components/StoreSettingsForm.vue'
import { useStoreSettingsEditor } from '../composables/UseStoreSettingsEditor'
const { t } = useT()
const editor = useStoreSettingsEditor()
</script>
<template>
  <div class="space-y-4">
    <PageHeader :title="t('settings.store')" />
    <RouterLink to="/settings/localization">{{ t('settings.localization') }}</RouterLink>
    <LoadingState v-if="editor.query.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value"
      :error="editor.query.error.value"
      @retry="editor.query.refetch()"
    />
    <StoreSettingsForm
      v-else
      v-model="editor.model.value"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      :canWrite="editor.canWrite.value"
      :uploading="editor.media.uploading.value"
      :uploadError="editor.media.error.value"
      :uploadProgress="editor.media.progress.value"
      :canRetryUpload="editor.media.canRetry.value"
      @uploadCancel="editor.media.cancel"
      @uploadRetry="editor.media.retry"
      @submit="editor.submit"
      @cancel="editor.cancel"
      @upload="editor.upload"
    />
  </div>
</template>
