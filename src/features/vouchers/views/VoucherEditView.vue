<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import VoucherForm from '@features/vouchers/components/VoucherForm.vue'
import VoucherStatusBadge from '@features/vouchers/components/VoucherStatusBadge.vue'
import { useVoucherEditor } from '@features/vouchers/composables/UseVoucherEditor'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useVoucherEditor()
const { t } = useT()
const format = useFormat()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="editor.query.data.value?.code ?? t('vouchers.title')">
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
    <LoadingState v-if="editor.query.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value"
      :error="editor.query.error.value"
      @retry="editor.query.refetch()"
    />
    <template v-else-if="editor.query.data.value">
      <p class="flex items-center gap-3 text-sm text-muted">
        <VoucherStatusBadge :status="editor.query.data.value.status" />
        <span>{{ t('vouchers.usedCount', { count: format.number(editor.query.data.value.usedCount) }) }}</span>
      </p>
      <VoucherForm
        v-model="editor.model.value"
        :errors="editor.errors.value"
        :pending="editor.mutation.isPending.value"
        :editing="true"
        :used="editor.used.value"
        :readOnly="!editor.canWrite.value"
        @submit="editor.submit"
        @cancel="editor.cancel"
      />
    </template>
  </div>
</template>
