<script setup lang="ts">
import StoreSettingsForm from '@features/settings/components/StoreSettingsForm.vue'
import { useStoreSettingsEditor } from '@features/settings/composables/UseStoreSettingsEditor'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const { t } = useT()
const editor = useStoreSettingsEditor()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('settings.store')" />
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
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
