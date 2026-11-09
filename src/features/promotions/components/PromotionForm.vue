<script setup lang="ts">
import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { PromotionInput } from '@features/promotions/schemas/Promotion.schema'
defineProps<{
  modelValue: PromotionInput
  errors: Record<string, string | undefined>
  pending: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: PromotionInput]; submit: []; cancel: [] }>()
const { t } = useT()
</script>
<template>
  <form class="space-y-4" @submit.prevent="emit('submit')">
    <FormSection :title="t('promotions.title')">
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
      <label
        >{{ t('promotions.type')
        }}<select
          name="type"
          :value="modelValue.type"
          @change="
            emit('update:modelValue', {
              ...modelValue,
              type: ($event.target as HTMLSelectElement).value as 'coupon' | 'auto',
            })
          "
        >
          <option value="coupon">{{ t('promotions.coupon') }}</option>
          <option value="auto">{{ t('promotions.auto') }}</option>
        </select>
      </label>
      <label v-if="modelValue.type === 'coupon'"
        >{{ t('promotions.code')
        }}<input
          name="code"
          :value="modelValue.code"
          @input="
            emit('update:modelValue', {
              ...modelValue,
              code: ($event.target as HTMLInputElement).value,
            })
          "
        />
      </label>
      <label
        >{{ t('promotions.discountType')
        }}<select
          name="discountType"
          :value="modelValue.discountType"
          @change="
            emit('update:modelValue', {
              ...modelValue,
              discountType: ($event.target as HTMLSelectElement).value as 'percent' | 'fixed',
            })
          "
        >
          <option value="percent">%</option>
          <option value="fixed">{{ t('promotions.fixed') }}</option>
        </select>
      </label>
      <label v-for="key in ['value', 'minimumOrder', 'usageLimit'] as const" :key="key"
        >{{ t(`promotions.${key}`)
        }}<input
          :name="key"
          type="number"
          min="0"
          :value="modelValue[key]"
          @input="
            emit('update:modelValue', {
              ...modelValue,
              [key]: Number(($event.target as HTMLInputElement).value),
            })
          "
        />
      </label>
      <label v-for="key in ['startAt', 'endAt'] as const" :key="key"
        >{{ t(`promotions.${key}`)
        }}<input
          :name="key"
          type="datetime-local"
          :value="modelValue[key]"
          @input="
            emit('update:modelValue', {
              ...modelValue,
              [key]: ($event.target as HTMLInputElement).value,
            })
          "
        />
      </label>
      <label
        >{{ t('common.status')
        }}<select
          name="status"
          :value="modelValue.status"
          @change="
            emit('update:modelValue', {
              ...modelValue,
              status: ($event.target as HTMLSelectElement).value as PromotionInput['status'],
            })
          "
        >
          <option v-for="status in ['draft', 'active', 'inactive'] as const" :key="status" :value="status">
            {{ t(`promotions.status.${status}`) }}
          </option>
        </select>
      </label>
      <p v-for="(error, key) in errors" :key="key" :data-error="key" role="alert">
        {{ error }}
      </p>
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
