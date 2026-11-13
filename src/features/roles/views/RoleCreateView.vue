<script setup lang="ts">
import RoleForm from '@features/roles/components/RoleForm.vue'
import { useRoleEditor } from '@features/roles/composables/UseRoleEditor'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useRoleEditor()
const { t } = useT()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('roles.title')" />
    <LoadingState v-if="editor.permissions.isPending.value" />
    <ErrorState
      v-else-if="editor.permissions.isError.value"
      :error="editor.permissions.error.value"
      @retry="editor.permissions.refetch()"
    />
    <RoleForm
      v-else
      v-model="editor.model.value"
      :errors="editor.errors.value"
      :pending="editor.mutation.isPending.value"
      :permissions="editor.permissions.data.value ?? []"
      :readOnly="false"
      :nameLocked="false"
      @submit="editor.submit"
      @cancel="editor.cancel"
    />
  </div>
</template>
