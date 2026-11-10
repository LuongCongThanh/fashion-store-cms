<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import { computed } from 'vue'

import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { PromotionInput } from '@features/promotions/schemas/Promotion.schema'
const props = defineProps<{
  modelValue: PromotionInput
  errors: Record<string, string | undefined>
  pending: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: PromotionInput]; submit: []; cancel: [] }>()
const { t } = useT()

const FIELDS = [
  'name',
  'type',
  'code',
  'discountType',
  'value',
  'minimumOrder',
  'usageLimit',
  'startAt',
  'endAt',
  'status',
]
/** Lỗi không gắn được vào field nào (ví dụ lỗi cấp form) vẫn phải hiện. */
const otherErrors = computed(() =>
  Object.entries(props.errors).filter(([key, error]) => error && !FIELDS.includes(key)),
)

function set<K extends keyof PromotionInput>(key: K, value: PromotionInput[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormSection :title="t('promotions.title')">
      <UFormField :label="t('common.name')" name="name" :error="errors.name">
        <UInput
          name="name"
          :modelValue="modelValue.name"
          class="w-full"
          @update:modelValue="set('name', String($event))"
        />
      </UFormField>
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField :label="t('promotions.type')" name="type" :error="errors.type">
          <USelect
            :modelValue="modelValue.type"
            :items="[
              { label: t('promotions.coupon'), value: 'coupon' },
              { label: t('promotions.auto'), value: 'auto' },
            ]"
            class="w-full"
            @update:modelValue="set('type', $event as PromotionInput['type'])"
          />
        </UFormField>
        <UFormField v-if="modelValue.type === 'coupon'" :label="t('promotions.code')" name="code" :error="errors.code">
          <UInput
            name="code"
            :modelValue="modelValue.code"
            class="w-full"
            :ui="{ base: 'font-mono uppercase' }"
            @update:modelValue="set('code', String($event))"
          />
        </UFormField>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField :label="t('promotions.discountType')" name="discountType" :error="errors.discountType">
          <USelect
            :modelValue="modelValue.discountType"
            :items="[
              { label: '%', value: 'percent' },
              { label: t('promotions.fixed'), value: 'fixed' },
            ]"
            class="w-full"
            @update:modelValue="set('discountType', $event as PromotionInput['discountType'])"
          />
        </UFormField>
        <UFormField
          v-for="key in ['value', 'minimumOrder', 'usageLimit'] as const"
          :key="key"
          :label="t(`promotions.${key}`)"
          :name="key"
          :error="errors[key]"
        >
          <UInputNumber
            :name="key"
            :data-field="key"
            :min="0"
            :modelValue="modelValue[key]"
            class="w-full"
            :ui="{ base: 'tabular-nums text-right' }"
            @update:modelValue="set(key, $event ?? 0)"
          />
        </UFormField>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField
          v-for="key in ['startAt', 'endAt'] as const"
          :key="key"
          :label="t(`promotions.${key}`)"
          :name="key"
          :error="errors[key]"
        >
          <UInput
            :name="key"
            type="datetime-local"
            :modelValue="modelValue[key]"
            class="w-full"
            @update:modelValue="set(key, String($event))"
          />
        </UFormField>
      </div>
      <UFormField :label="t('common.status')" name="status" :error="errors.status">
        <USelect
          :modelValue="modelValue.status"
          :items="
            (['draft', 'active', 'inactive'] as const).map((status) => ({
              label: t(`promotions.status.${status}`),
              value: status,
            }))
          "
          class="w-full sm:w-60"
          @update:modelValue="set('status', $event as PromotionInput['status'])"
        />
      </UFormField>
      <p v-for="[key, error] in otherErrors" :key="key" :data-error="key" role="alert" class="text-sm">
        {{ error }}
      </p>
    </FormSection>
    <FormActions :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
