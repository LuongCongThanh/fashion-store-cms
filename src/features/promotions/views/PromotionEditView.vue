<script setup lang="ts">
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'

import PromotionForm from '../components/PromotionForm.vue'
import { usePromotionEditor } from '../composables/UsePromotionEditor'
const editor = usePromotionEditor()
const { t } = useT()
</script>
<template>
  <div class="space-y-4">
    <PageHeader :title="t('promotions.title')" />
    <LoadingState v-if="editor.id.value && editor.query.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value"
      :error="editor.query.error.value"
      @retry="editor.query.refetch()"
    />
    <PromotionForm
      v-else
      v-model="editor.model.value"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
