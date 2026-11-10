<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'

import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { RoleInput } from '@features/roles/schemas/Role.schema'
import type { Permission } from '@features/roles/types/Role.types'

import PermissionMatrix from './PermissionMatrix.vue'
defineProps<{
  modelValue: RoleInput
  permissions: Permission[]
  pending: boolean
  errors: Record<string, string | undefined>
}>()
const emit = defineEmits<{ 'update:modelValue': [value: RoleInput]; submit: []; cancel: [] }>()
const { t } = useT()
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('roles.title')">
      <UFormField :label="t('common.name')" name="name" :error="errors.name">
        <UInput
          name="name"
          :modelValue="modelValue.name"
          class="w-full sm:w-96"
          @update:modelValue="emit('update:modelValue', { ...modelValue, name: String($event) })"
        />
      </UFormField>
      <PermissionMatrix
        :modelValue="modelValue.permissions"
        :permissions="permissions"
        @update:modelValue="emit('update:modelValue', { ...modelValue, permissions: $event })"
      />
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
