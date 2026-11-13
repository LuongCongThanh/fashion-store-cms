<script setup lang="ts">
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import { computed } from 'vue'

import FormActions from '@shared/components/form/FormActions.vue'
import FormSection from '@shared/components/form/FormSection.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { VoucherInput } from '@features/vouchers/schemas/Voucher.schema'
const props = defineProps<{
  modelValue: VoucherInput
  errors: Record<string, string | undefined>
  pending: boolean
  /** Sửa Voucher: mã khoá. */
  editing: boolean
  /** Đã dùng: điều kiện giảm và thời gian bắt đầu khoá. */
  used: boolean
  readOnly: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: VoucherInput]; submit: []; cancel: [] }>()
const { t } = useT()

const FIELDS = [
  'code',
  'type',
  'value',
  'maxDiscount',
  'minSubtotal',
  'totalLimit',
  'perBuyerLimit',
  'startsAt',
  'endsAt',
  'isActive',
]
/** Lỗi không gắn được vào field nào (ví dụ lỗi cấp form) vẫn phải hiện. */
const otherErrors = computed(() =>
  Object.entries(props.errors).filter(([key, error]) => error && !FIELDS.includes(key)),
)
const termsLocked = computed(() => props.readOnly || props.used)

function set<K extends keyof VoucherInput>(key: K, value: VoucherInput[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <fieldset :disabled="readOnly" class="space-y-6">
      <FormSection :title="t('vouchers.terms')" :description="used ? t('vouchers.usedHint') : undefined">
        <UFormField :label="t('vouchers.code')" name="code" :error="errors.code" :hint="t('vouchers.codeHint')">
          <UInput
            name="code"
            :modelValue="modelValue.code"
            :disabled="editing"
            class="w-full sm:w-80"
            :ui="{ base: 'font-mono uppercase' }"
            @update:modelValue="set('code', String($event))"
          />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t('vouchers.type')" name="type" :error="errors.type">
            <USelect
              :modelValue="modelValue.type"
              :disabled="termsLocked"
              :items="[
                { label: t('vouchers.types.PERCENT'), value: 'PERCENT' },
                { label: t('vouchers.types.FIXED'), value: 'FIXED' },
              ]"
              class="w-full"
              @update:modelValue="set('type', $event as VoucherInput['type'])"
            />
          </UFormField>
          <UFormField
            :label="modelValue.type === 'PERCENT' ? t('vouchers.percentValue') : t('vouchers.fixedValue')"
            name="value"
            :error="errors.value"
          >
            <UInputNumber
              name="value"
              :min="1"
              :max="modelValue.type === 'PERCENT' ? 100 : undefined"
              :stepSnapping="true"
              :formatOptions="{ maximumFractionDigits: 0 }"
              :disabled="termsLocked"
              :modelValue="modelValue.value"
              class="w-full"
              :ui="{ base: 'tabular-nums text-right' }"
              @update:modelValue="set('value', $event ?? 0)"
            />
          </UFormField>
          <UFormField
            v-if="modelValue.type === 'PERCENT'"
            :label="t('vouchers.maxDiscount')"
            name="maxDiscount"
            :error="errors.maxDiscount"
            :hint="t('vouchers.emptyUnlimited')"
          >
            <UInputNumber
              name="maxDiscount"
              :min="1"
              :formatOptions="{ maximumFractionDigits: 0 }"
              :disabled="termsLocked"
              :modelValue="modelValue.maxDiscount ?? undefined"
              class="w-full"
              :ui="{ base: 'tabular-nums text-right' }"
              @update:modelValue="set('maxDiscount', $event ?? null)"
            />
          </UFormField>
          <UFormField
            :label="t('vouchers.minSubtotal')"
            name="minSubtotal"
            :error="errors.minSubtotal"
            :hint="t('vouchers.zeroNone')"
          >
            <UInputNumber
              name="minSubtotal"
              :min="0"
              :formatOptions="{ maximumFractionDigits: 0 }"
              :disabled="termsLocked"
              :modelValue="modelValue.minSubtotal"
              class="w-full"
              :ui="{ base: 'tabular-nums text-right' }"
              @update:modelValue="set('minSubtotal', $event ?? 0)"
            />
          </UFormField>
        </div>
      </FormSection>
      <FormSection :title="t('vouchers.limits')">
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField
            v-for="key in ['totalLimit', 'perBuyerLimit'] as const"
            :key="key"
            :label="t(`vouchers.${key}`)"
            :name="key"
            :error="errors[key]"
            :hint="t('vouchers.emptyUnlimited')"
          >
            <UInputNumber
              :name="key"
              :min="1"
              :stepSnapping="true"
              :formatOptions="{ maximumFractionDigits: 0 }"
              :modelValue="modelValue[key] ?? undefined"
              class="w-full"
              :ui="{ base: 'tabular-nums text-right' }"
              @update:modelValue="set(key, $event ?? null)"
            />
          </UFormField>
          <UFormField :label="t('vouchers.startsAt')" name="startsAt" :error="errors.startsAt">
            <UInput
              name="startsAt"
              type="datetime-local"
              :disabled="termsLocked"
              :modelValue="modelValue.startsAt"
              class="w-full"
              @update:modelValue="set('startsAt', String($event))"
            />
          </UFormField>
          <UFormField :label="t('vouchers.endsAt')" name="endsAt" :error="errors.endsAt">
            <UInput
              name="endsAt"
              type="datetime-local"
              :modelValue="modelValue.endsAt"
              class="w-full"
              @update:modelValue="set('endsAt', String($event))"
            />
          </UFormField>
        </div>
        <UCheckbox
          name="isActive"
          :label="t('vouchers.isActive')"
          :description="t('vouchers.isActiveHint')"
          :modelValue="modelValue.isActive"
          @update:modelValue="set('isActive', $event === true)"
        />
        <p v-for="[key, error] in otherErrors" :key="key" :data-error="key" role="alert" class="text-sm text-error">
          {{ error }}
        </p>
      </FormSection>
    </fieldset>
    <FormActions v-if="!readOnly" :pending="pending" @cancel="emit('cancel')" />
  </form>
</template>
