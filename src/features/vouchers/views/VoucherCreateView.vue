<script setup lang="ts">
import VoucherForm from '@features/vouchers/components/VoucherForm.vue'
import { useVoucherEditor } from '@features/vouchers/composables/UseVoucherEditor'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useVoucherEditor()
const { t } = useT()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('vouchers.create')" />
    <VoucherForm
      v-model="editor.model.value"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      :editing="false"
      :used="false"
      :readOnly="false"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
