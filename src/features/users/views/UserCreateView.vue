<script setup lang="ts">
import UserForm from '@features/users/components/UserForm.vue'
import { useUserEditor } from '@features/users/composables/UseUserEditor'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useUserEditor()
const { t } = useT()
function retry() {
  void editor.query.refetch()
  void editor.roles.refetch()
  void editor.stores.refetch()
}
</script>
<template>
  <div class="space-y-4">
    <PageHeader :title="t('users.title')" />
    <LoadingState
      v-if="
        editor.roles.isPending.value ||
        editor.stores.isPending.value ||
        (editor.id.value && editor.query.isPending.value)
      "
    />
    <ErrorState
      v-else-if="editor.query.isError.value || editor.roles.isError.value || editor.stores.isError.value"
      :error="editor.query.error.value ?? editor.roles.error.value ?? editor.stores.error.value"
      @retry="retry"
    />
    <UserForm
      v-else
      v-model="editor.model.value"
      :roles="editor.roles.data.value?.data ?? []"
      :stores="editor.stores.data.value ?? []"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
