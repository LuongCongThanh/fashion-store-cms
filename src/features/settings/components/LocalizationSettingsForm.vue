<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import { computed } from 'vue'

import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { LocalizationInput } from '@features/settings/schemas/Settings.schema'
const props = defineProps<{
  modelValue: LocalizationInput
  errors: Record<string, string | undefined>
  pending: boolean
  canWrite: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value: LocalizationInput]
  submit: []
  cancel: []
}>()
const { t } = useT()

const FIELDS = ['languages', 'defaultLanguage', 'timezone', 'currency', 'numberFormat', 'dateFormat']
/** Lỗi không gắn được vào field nào vẫn phải hiện. */
const otherErrors = computed(() =>
  Object.entries(props.errors).filter(([key, error]) => error && !FIELDS.includes(key)),
)

function set<K extends keyof LocalizationInput>(key: K, value: LocalizationInput[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <fieldset :disabled="!canWrite || pending">
      <FormSection :title="t('settings.localization')">
        <UFormField :label="t('settings.languages')" name="languages" :error="errors.languages">
          <UInput
            name="languages"
            :modelValue="modelValue.languages.join(',')"
            class="w-full sm:w-96"
            @update:modelValue="
              set(
                'languages',
                String($event)
                  .split(',')
                  .map((value) => value.trim())
                  .filter(Boolean),
              )
            "
          />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t('settings.defaultLanguage')" name="defaultLanguage" :error="errors.defaultLanguage">
            <USelect
              :modelValue="modelValue.defaultLanguage"
              :items="modelValue.languages"
              class="w-full"
              @update:modelValue="set('defaultLanguage', String($event))"
            />
          </UFormField>
          <UFormField
            v-for="key in ['timezone', 'currency', 'numberFormat'] as const"
            :key="key"
            :label="t(`settings.${key}`)"
            :name="key"
            :error="errors[key]"
          >
            <UInput
              :name="key"
              :modelValue="modelValue[key]"
              class="w-full"
              @update:modelValue="set(key, String($event))"
            />
          </UFormField>
          <UFormField :label="t('settings.dateFormat')" name="dateFormat" :error="errors.dateFormat">
            <USelect
              :modelValue="modelValue.dateFormat"
              :items="['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']"
              class="w-full"
              @update:modelValue="set('dateFormat', $event as LocalizationInput['dateFormat'])"
            />
          </UFormField>
        </div>
        <p v-for="[key, error] in otherErrors" :key="key" :data-error="key" role="alert" class="text-sm">
          {{ error }}
        </p>
      </FormSection>
    </fieldset>
    <FormActions v-if="canWrite" :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
