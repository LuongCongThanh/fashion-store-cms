<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UTextarea from '@nuxt/ui/components/Textarea.vue'

import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { RoleInput } from '@features/roles/schemas/Role.schema'
import type { PermissionGroup } from '@features/roles/types/Role.types'

import PermissionMatrix from './PermissionMatrix.vue'
defineProps<{
  modelValue: RoleInput
  permissions: PermissionGroup[]
  pending: boolean
  errors: Record<string, string | undefined>
  readOnly: boolean
  nameLocked: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: RoleInput]; submit: []; cancel: [] }>()
const { t } = useT()
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <UAlert v-if="readOnly" color="neutral" variant="subtle" icon="i-lucide-lock" :title="t('roles.readOnly')" />
    <FormSection :title="t('roles.title')">
      <UFormField
        :label="t('common.name')"
        name="name"
        :error="errors.name"
        :help="nameLocked && !readOnly ? t('roles.systemNameLocked') : undefined"
      >
        <UInput
          name="name"
          :modelValue="modelValue.name"
          :disabled="readOnly || nameLocked"
          class="w-full sm:w-96"
          @update:modelValue="emit('update:modelValue', { ...modelValue, name: String($event) })"
        />
      </UFormField>
      <UFormField :label="t('roles.description')" name="description" :error="errors.description">
        <UTextarea
          name="description"
          :modelValue="modelValue.description ?? ''"
          :disabled="readOnly"
          :rows="2"
          class="w-full sm:w-96"
          @update:modelValue="emit('update:modelValue', { ...modelValue, description: String($event) })"
        />
      </UFormField>
      <PermissionMatrix
        :modelValue="modelValue.permissions"
        :groups="permissions"
        :disabled="readOnly"
        @update:modelValue="emit('update:modelValue', { ...modelValue, permissions: $event })"
      />
    </FormSection>
    <footer v-if="readOnly" class="flex justify-end">
      <UButton type="button" color="neutral" variant="outline" @click="emit('cancel')">{{ t('common.back') }}</UButton>
    </footer>
    <FormActions v-else :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
