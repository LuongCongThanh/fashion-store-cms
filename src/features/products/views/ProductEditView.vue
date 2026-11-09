<script setup lang="ts">
import ProductForm from '@features/products/components/ProductForm.vue'
import { useProductEditor } from '@features/products/composables/UseProductEditor'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useProductEditor()
const { t } = useT()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('dashboard.products')" />
    <LoadingState v-if="editor.id.value && editor.query.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value"
      :error="editor.query.error.value"
      @retry="editor.query.refetch()"
    />
    <ProductForm
      v-else
      v-model="editor.model.value"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      :categories="editor.categories.data.value ?? []"
      :uploading="editor.media.uploading.value"
      :uploadError="editor.media.error.value"
      :uploadProgress="editor.media.progress.value"
      :canRetryUpload="editor.media.canRetry.value"
      :uploadedImage="editor.media.image.value"
      @uploadCancel="editor.media.cancel"
      @uploadRetry="editor.media.retry"
      @upload="editor.upload"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
