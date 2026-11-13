<script setup lang="ts">
import SizeForm from '@features/sizes/components/SizeForm.vue'
import { useSizeEditor } from '@features/sizes/composables/UseSizeEditor'
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useSizeEditor()
const { t } = useT()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('sizes.title')" />
    <LoadingState v-if="editor.id.value && editor.query.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value"
      :error="editor.query.error.value"
      @retry="editor.query.refetch()"
    />
    <EmptyState v-else-if="editor.notFound.value" :title="t('errors.NOT_FOUND')" />
    <SizeForm
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
