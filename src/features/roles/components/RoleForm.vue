<script setup lang="ts">
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
  <form class="space-y-5" @submit.prevent="emit('submit')">
    <FormSection :title="t('roles.title')">
      <label
        >{{ t('common.name')
        }}<input
          name="name"
          :value="modelValue.name"
          @input="
            emit('update:modelValue', {
              ...modelValue,
              name: ($event.target as HTMLInputElement).value,
            })
          "
        />
      </label>
      <p v-if="errors.name" role="alert">{{ errors.name }}</p>
      <PermissionMatrix
        :modelValue="modelValue.permissions"
        :permissions="permissions"
        @update:modelValue="emit('update:modelValue', { ...modelValue, permissions: $event })"
      />
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
