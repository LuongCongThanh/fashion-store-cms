<script setup lang="ts">
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'

import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { SizeInput } from '@features/sizes/schemas/Size.schema'
const props = defineProps<{
  modelValue: SizeInput
  errors: Record<string, string | undefined>
  pending: boolean
  codeLocked: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: SizeInput]; submit: []; cancel: [] }>()
const { t } = useT()
function update<K extends keyof SizeInput>(key: K, value: SizeInput[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('sizes.title')">
      <UFormField
        :label="t('sizes.code')"
        name="code"
        :error="errors.code"
        :hint="codeLocked ? t('sizes.codeLocked') : t('sizes.codeHint')"
      >
        <UInput
          name="code"
          :modelValue="modelValue.code"
          :disabled="codeLocked"
          class="w-full"
          @update:modelValue="update('code', String($event ?? '').toUpperCase())"
        />
        <template #error="{ error }">
          <span data-error="code">{{ error }}</span>
        </template>
      </UFormField>
      <UFormField :label="t('common.name')" name="name" :error="errors.name">
        <UInput
          name="name"
          :modelValue="modelValue.name"
          class="w-full"
          @update:modelValue="update('name', String($event ?? ''))"
        />
        <template #error="{ error }">
          <span data-error="name">{{ error }}</span>
        </template>
      </UFormField>
      <UFormField :label="t('sizes.sortOrder')" name="sortOrder" :error="errors.sortOrder">
        <UInputNumber
          name="sortOrder"
          :modelValue="modelValue.sortOrder"
          :min="0"
          @update:modelValue="update('sortOrder', Number($event ?? 0))"
        />
      </UFormField>
      <UCheckbox
        name="isHidden"
        :label="t('sizes.isHidden')"
        :description="t('sizes.isHiddenHint')"
        :modelValue="modelValue.isHidden"
        @update:modelValue="update('isHidden', $event === true)"
      />
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
