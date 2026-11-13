<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UTextarea from '@nuxt/ui/components/Textarea.vue'

import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { StoreSettingsInput } from '@features/settings/schemas/Settings.schema'
const props = defineProps<{
  modelValue: StoreSettingsInput
  errors: Record<string, string | undefined>
  pending: boolean
  canWrite: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value: StoreSettingsInput]
  submit: []
  cancel: []
}>()
const { t } = useT()
function set(
  key: 'name' | 'description' | 'contactEmail' | 'phone' | 'address',
  value: string | number | null | undefined,
) {
  emit('update:modelValue', { ...props.modelValue, [key]: String(value ?? '') })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <fieldset :disabled="!canWrite || pending">
      <FormSection :title="t('settings.store')">
        <UFormField :label="t('settings.name')" name="name" :error="errors.name">
          <UInput name="name" :modelValue="modelValue.name" class="w-full" @update:modelValue="set('name', $event)" />
        </UFormField>
        <UFormField :label="t('settings.description')" name="description" :error="errors.description">
          <UTextarea
            name="description"
            :modelValue="modelValue.description"
            :rows="3"
            autoresize
            class="w-full"
            @update:modelValue="set('description', $event)"
          />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t('settings.contactEmail')" name="contactEmail" :error="errors.contactEmail">
            <UInput
              name="contactEmail"
              type="email"
              :modelValue="modelValue.contactEmail"
              class="w-full"
              @update:modelValue="set('contactEmail', $event)"
            />
          </UFormField>
          <UFormField :label="t('settings.phone')" name="phone" :error="errors.phone">
            <UInput
              name="phone"
              type="tel"
              :modelValue="modelValue.phone"
              class="w-full"
              @update:modelValue="set('phone', $event)"
            />
          </UFormField>
        </div>
        <UFormField :label="t('settings.address')" name="address" :error="errors.address">
          <UInput
            name="address"
            :modelValue="modelValue.address"
            class="w-full"
            @update:modelValue="set('address', $event)"
          />
        </UFormField>
      </FormSection>
    </fieldset>
    <FormActions v-if="canWrite" :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
