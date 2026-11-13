<script setup lang="ts">
import ProductInfoForm from '@features/products/components/ProductInfoForm.vue'
import { useProductCreate } from '@features/products/composables/UseProductCreate'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useProductCreate()
const { t } = useT()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('products.createTitle')" :description="t('products.createHint')" />
    <ProductInfoForm
      v-model="editor.model.value"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      :categories="editor.categories.data.value ?? []"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
