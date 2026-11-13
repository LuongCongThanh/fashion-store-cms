<script setup lang="ts">
import InternalAccountForm from '@features/accounts/components/InternalAccountForm.vue'
import { useInternalAccountCreate } from '@features/accounts/composables/UseInternalAccountCreate'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useInternalAccountCreate()
const { t } = useT()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('internalAccounts.title')" />
    <InternalAccountForm
      v-model="editor.model.value"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
