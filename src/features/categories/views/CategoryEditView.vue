<script setup lang="ts">
import CategoryForm from '@features/categories/components/CategoryForm.vue'
import { useCategoryEditor } from '@features/categories/composables/UseCategoryEditor'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useCategoryEditor()
const { t } = useT()
</script>
<template>
  <div class="space-y-4">
    <PageHeader :title="t('products.category')" />
    <LoadingState v-if="editor.id.value && editor.query.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value"
      :error="editor.query.error.value"
      @retry="editor.query.refetch()"
    />
    <CategoryForm
      v-else
      :id="editor.id.value"
      v-model="editor.model.value"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      :categories="editor.parentOptions.value"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
