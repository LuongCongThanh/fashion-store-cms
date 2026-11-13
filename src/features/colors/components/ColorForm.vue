<script setup lang="ts">
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'

import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { ColorInput } from '@features/colors/schemas/Color.schema'
const props = defineProps<{
  modelValue: ColorInput
  errors: Record<string, string | undefined>
  pending: boolean
  codeLocked: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: ColorInput]; submit: []; cancel: [] }>()
const { t } = useT()
function update<K extends keyof ColorInput>(key: K, value: ColorInput[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('colors.title')">
      <UFormField
        :label="t('colors.code')"
        name="code"
        :error="errors.code"
        :hint="codeLocked ? t('colors.codeLocked') : t('colors.codeHint')"
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
      <UFormField :label="t('colors.hex')" name="hex" :error="errors.hex">
        <div class="flex items-center gap-3">
          <input
            type="color"
            :aria-label="t('colors.hex')"
            :value="modelValue.hex"
            class="h-9 w-12 cursor-pointer rounded border border-default"
            @input="update('hex', ($event.target as HTMLInputElement).value.toUpperCase())"
          />
          <UInput
            name="hex"
            :modelValue="modelValue.hex"
            class="w-32"
            @update:modelValue="update('hex', String($event ?? '').toUpperCase())"
          />
        </div>
        <template #error="{ error }">
          <span data-error="hex">{{ error }}</span>
        </template>
      </UFormField>
      <UCheckbox
        name="isHidden"
        :label="t('colors.isHidden')"
        :description="t('colors.isHiddenHint')"
        :modelValue="modelValue.isHidden"
        @update:modelValue="update('isHidden', $event === true)"
      />
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
