<script setup lang="ts">
import ColorForm from '@features/colors/components/ColorForm.vue'
import { useColorEditor } from '@features/colors/composables/UseColorEditor'
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useColorEditor()
const { t } = useT()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('colors.title')" />
    <LoadingState v-if="editor.id.value && editor.query.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value"
      :error="editor.query.error.value"
      @retry="editor.query.refetch()"
    />
    <EmptyState v-else-if="editor.notFound.value" :title="t('errors.NOT_FOUND')" />
    <ColorForm
      v-else
      v-model="editor.model.value"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      :codeLocked="!!editor.id.value"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
