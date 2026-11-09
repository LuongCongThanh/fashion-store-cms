<script setup lang="ts">
import LocalizationSettingsForm from '@features/settings/components/LocalizationSettingsForm.vue'
import { useLocalizationEditor } from '@features/settings/composables/UseLocalizationEditor'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const { t } = useT()
const editor = useLocalizationEditor()
</script>
<template>
  <div class="space-y-4">
    <PageHeader :title="t('settings.localization')" />
    <RouterLink to="/settings/store">{{ t('settings.store') }}</RouterLink>
    <LoadingState v-if="editor.query.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value"
      :error="editor.query.error.value"
      @retry="editor.query.refetch()"
    />
    <LocalizationSettingsForm
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
