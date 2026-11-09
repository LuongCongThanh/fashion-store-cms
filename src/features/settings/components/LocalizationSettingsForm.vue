<script setup lang="ts">
import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { LocalizationInput } from '@features/settings/schemas/Settings.schema'
defineProps<{
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
</script>

<template>
  <form class="space-y-5" @submit.prevent="emit('submit')">
    <fieldset :disabled="!canWrite || pending">
      <FormSection :title="t('settings.localization')">
        <label
          >{{ t('settings.languages')
          }}<input
            name="languages"
            :value="modelValue.languages.join(',')"
            @input="
              emit('update:modelValue', {
                ...modelValue,
                languages: ($event.target as HTMLInputElement).value
                  .split(',')
                  .map((value) => value.trim())
                  .filter(Boolean),
              })
            "
          />
        </label>
        <label
          >{{ t('settings.defaultLanguage')
          }}<select
            name="defaultLanguage"
            :value="modelValue.defaultLanguage"
            @change="
              emit('update:modelValue', {
                ...modelValue,
                defaultLanguage: ($event.target as HTMLSelectElement).value,
              })
            "
          >
            <option v-for="language in modelValue.languages" :key="language" :value="language">
              {{ language }}
            </option>
          </select>
        </label>
        <label v-for="key in ['timezone', 'currency', 'numberFormat'] as const" :key="key" class="block"
          >{{ t(`settings.${key}`)
          }}<input
            :name="key"
            :value="modelValue[key]"
            class="block rounded border border-default bg-default p-2"
            @input="
              emit('update:modelValue', {
                ...modelValue,
                [key]: ($event.target as HTMLInputElement).value,
              })
            "
          />
        </label>
        <label
          >{{ t('settings.dateFormat')
          }}<select
            name="dateFormat"
            :value="modelValue.dateFormat"
            @change="
              emit('update:modelValue', {
                ...modelValue,
                dateFormat: ($event.target as HTMLSelectElement).value as LocalizationInput['dateFormat'],
              })
            "
          >
            <option v-for="format in ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']" :key="format" :value="format">
              {{ format }}
            </option>
          </select>
        </label>
        <p v-for="(error, key) in errors" :key="key" :data-error="key" role="alert">
          {{ error }}
        </p>
      </FormSection>
    </fieldset>
    <FormActions v-if="canWrite" :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
