<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import UButton from '@nuxt/ui/components/Button.vue'

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
    <PageHeader :title="editor.query.data.value?.name ?? t('products.category')">
      <template v-if="editor.canDelete.value" #actions>
        <UButton
          color="error"
          variant="outline"
          icon="i-lucide-trash-2"
          :loading="editor.removal.isPending.value"
          @click="editor.remove"
        >
          {{ t('common.delete') }}
        </UButton>
      </template>
    </PageHeader>
    <UAlert
      v-if="editor.deleteBlocked.value"
      color="warning"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      :title="t('categories.notEmpty')"
    />
    <LoadingState v-if="editor.id.value && editor.query.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value"
      :error="editor.query.error.value"
      @retry="editor.query.refetch()"
    />
    <CategoryForm
      v-else
      v-model="editor.model.value"
      :slug="editor.query.data.value?.slug"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      :categories="editor.parentOptions.value"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
