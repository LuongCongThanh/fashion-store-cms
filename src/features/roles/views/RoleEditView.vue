<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

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
    <PageHeader :title="editor.query.data.value?.name ?? t('roles.title')">
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
    <LoadingState v-if="editor.permissions.isPending.value || editor.query.isPending.value" />
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
      :readOnly="editor.readOnly.value"
      :nameLocked="editor.nameLocked.value"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
