<script setup lang="ts">
import RoleForm from '@features/roles/components/RoleForm.vue'
import { useRoleEditor } from '@features/roles/composables/UseRoleEditor'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useRoleEditor()
const { t } = useT()
function retry() {
  void editor.query.refetch()
  void editor.permissions.refetch()
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('roles.title')" />
    <LoadingState v-if="editor.permissions.isPending.value || (editor.id.value && editor.query.isPending.value)" />
    <ErrorState
      v-else-if="editor.query.isError.value || editor.permissions.isError.value"
      :error="editor.query.error.value ?? editor.permissions.error.value"
      @retry="retry"
    />
    <RoleForm
      v-else
      v-model="editor.model.value"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      :permissions="editor.permissions.data.value ?? []"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
