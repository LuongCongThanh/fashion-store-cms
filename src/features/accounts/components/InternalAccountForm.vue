<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'

import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { CreateInternalAccountInput } from '@features/accounts/schemas/InternalAccount.schema'

const props = defineProps<{
  modelValue: CreateInternalAccountInput
  errors: Record<string, string | undefined>
  pending: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: CreateInternalAccountInput]; submit: []; cancel: [] }>()
const { t } = useT()

function set<K extends keyof CreateInternalAccountInput>(key: K, value: CreateInternalAccountInput[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('internalAccounts.title')" :description="t('internalAccounts.createHint')">
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField :label="t('common.name')" name="name" :error="errors.name">
          <UInput
            name="name"
            :modelValue="modelValue.name"
            class="w-full"
            @update:modelValue="set('name', String($event))"
          />
        </UFormField>
        <UFormField :label="t('auth.login.email')" name="email" :error="errors.email">
          <UInput
            name="email"
            type="email"
            autocomplete="off"
            :modelValue="modelValue.email"
            class="w-full"
            @update:modelValue="set('email', String($event))"
          />
        </UFormField>
        <UFormField
          :label="t('internalAccounts.initialPassword')"
          name="password"
          :error="errors.password"
          :help="t('internalAccounts.passwordHint')"
        >
          <UInput
            name="password"
            type="password"
            autocomplete="new-password"
            :modelValue="modelValue.password"
            class="w-full"
            @update:modelValue="set('password', String($event))"
          />
        </UFormField>
      </div>
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
