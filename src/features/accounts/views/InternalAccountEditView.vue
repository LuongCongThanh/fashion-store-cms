<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'

import InternalAccountRoles from '@features/accounts/components/InternalAccountRoles.vue'
import { useInternalAccountEditor } from '@features/accounts/composables/UseInternalAccountEditor'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const editor = useInternalAccountEditor()
const { t } = useT()
function retry() {
  void editor.query.refetch()
  void editor.roles.refetch()
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="editor.query.data.value?.name ?? t('internalAccounts.title')">
      <template v-if="editor.canWrite.value && editor.query.data.value" #actions>
        <UButton
          v-if="editor.query.data.value.status === 'ACTIVE'"
          color="error"
          variant="outline"
          icon="i-lucide-user-x"
          :loading="editor.status.isPending.value"
          @click="editor.setStatus('DISABLED')"
        >
          {{ t('internalAccounts.disable') }}
        </UButton>
        <UButton
          v-else
          variant="outline"
          icon="i-lucide-user-check"
          :loading="editor.status.isPending.value"
          @click="editor.setStatus('ACTIVE')"
        >
          {{ t('internalAccounts.enable') }}
        </UButton>
      </template>
    </PageHeader>
    <LoadingState v-if="editor.query.isPending.value || editor.roles.isPending.value" />
    <ErrorState
      v-else-if="editor.query.isError.value || editor.roles.isError.value"
      :error="editor.query.error.value ?? editor.roles.error.value"
      @retry="retry"
    />
    <template v-else-if="editor.query.data.value">
      <FormSection :title="t('internalAccounts.title')">
        <form class="flex flex-wrap items-end gap-3" @submit.prevent="editor.saveName">
          <UFormField :label="t('common.name')" name="name" :error="editor.nameError.value">
            <UInput v-model="editor.name.value" name="name" :disabled="!editor.canWrite.value" class="w-full sm:w-80" />
          </UFormField>
          <UButton
            v-if="editor.canWrite.value"
            type="submit"
            :disabled="!editor.nameDirty.value"
            :loading="editor.rename.isPending.value"
          >
            {{ t('common.save') }}
          </UButton>
        </form>
        <dl class="grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
          <dt class="text-muted">{{ t('auth.login.email') }}</dt>
          <dd>{{ editor.query.data.value.email }}</dd>
          <dt class="text-muted">{{ t('common.status') }}</dt>
          <dd>
            <StatusBadge
              :label="editor.query.data.value.status === 'ACTIVE' ? t('common.active') : t('common.inactive')"
              :color="editor.query.data.value.status === 'ACTIVE' ? 'success' : 'neutral'"
            />
          </dd>
        </dl>
      </FormSection>
      <FormSection :title="t('roles.title')">
        <InternalAccountRoles
          :options="editor.roles.data.value?.data ?? []"
          :assigned="editor.query.data.value.roles.map((role) => role.id)"
          :disabled="!editor.canWrite.value"
          :pendingRoleId="editor.pendingRoleId.value"
          @toggle="editor.toggleRole"
        />
      </FormSection>
      <div class="flex justify-end">
        <UButton type="button" color="neutral" variant="outline" @click="editor.back">{{ t('common.back') }}</UButton>
      </div>
    </template>
  </div>
</template>
