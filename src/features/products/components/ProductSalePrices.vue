<script setup lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UCheckboxGroup from '@nuxt/ui/components/CheckboxGroup.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import URadioGroup from '@nuxt/ui/components/RadioGroup.vue'
import { computed } from 'vue'

import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { SalePriceFormInput } from '@features/products/schemas/SalePrice.schema'
import type { ProductVariant } from '@features/products/types/Product.types'
import type { SalePrice } from '@features/products/types/SalePrice.types'
import type { SalePriceEdit, SalePriceFormErrors, SalePriceRow } from '@features/products/types/SalePriceView.types'

const props = defineProps<{
  rows: SalePriceRow[]
  variants: ProductVariant[]
  form: SalePriceFormInput
  errors: SalePriceFormErrors
  editing: SalePriceEdit | null
  editError?: string
  canWrite: boolean
  creating: boolean
  updating: boolean
}>()
const emit = defineEmits<{
  form: [key: keyof SalePriceFormInput, value: SalePriceFormInput[keyof SalePriceFormInput]]
  submit: []
  edit: [sale: SalePrice]
  editField: [key: 'price' | 'startsAt' | 'endsAt', value: string | number]
  saveEdit: [sale: SalePrice]
  cancelEdit: []
  endNow: [row: SalePriceRow]
  remove: [row: SalePriceRow]
}>()
const { t } = useT()
const format = useFormat()
const statusColor = { UPCOMING: 'info', ACTIVE: 'success', ENDED: 'neutral' } as const
const variantItems = computed(() =>
  props.variants.map((v) => ({ label: `${v.color.name} · ${v.size.code} — ${format.money(v.price)}`, value: v.id })),
)
const modeItems = computed(() => [
  { label: t('salePrices.modePercent'), value: 'percent' },
  { label: t('salePrices.modePrice'), value: 'price' },
])
const isEditing = (sale: SalePrice) => props.editing?.id === sale.id
</script>

<template>
  <div class="space-y-4">
    <form
      v-if="canWrite"
      class="space-y-4 rounded-lg border border-dashed border-default p-4"
      data-form="add-sale-price"
      @submit.prevent="emit('submit')"
    >
      <p v-if="!variants.length" class="text-sm text-muted">{{ t('salePrices.noActiveVariant') }}</p>
      <template v-else>
        <UFormField :label="t('salePrices.variants')" name="variantIds" :error="errors.variantIds" size="sm">
          <UCheckboxGroup
            :modelValue="form.variantIds"
            :items="variantItems"
            data-field="variantIds"
            @update:modelValue="emit('form', 'variantIds', $event as string[])"
          />
        </UFormField>
        <div class="grid items-start gap-3 sm:grid-cols-[auto_1fr_1fr_1fr_auto]">
          <UFormField :label="t('salePrices.mode')" name="mode" size="sm">
            <URadioGroup
              :modelValue="form.mode"
              :items="modeItems"
              orientation="horizontal"
              data-field="mode"
              @update:modelValue="emit('form', 'mode', $event as 'price' | 'percent')"
            />
          </UFormField>
          <UFormField
            :label="form.mode === 'percent' ? t('salePrices.percentOff') : t('salePrices.price')"
            name="amount"
            :error="errors.amount"
            size="sm"
          >
            <UInputNumber
              data-field="amount"
              :modelValue="form.amount"
              :min="1"
              :max="form.mode === 'percent' ? 99 : undefined"
              :increment="false"
              :decrement="false"
              class="w-full"
              :ui="{ base: 'tabular-nums text-right' }"
              @update:modelValue="emit('form', 'amount', Number($event ?? 0))"
            />
          </UFormField>
          <UFormField :label="t('salePrices.startsAt')" name="startsAt" :hint="t('salePrices.startsAtHint')" size="sm">
            <UInput
              type="datetime-local"
              name="startsAt"
              :modelValue="form.startsAt"
              class="w-full"
              @update:modelValue="emit('form', 'startsAt', String($event ?? ''))"
            />
          </UFormField>
          <UFormField :label="t('salePrices.endsAt')" name="endsAt" :error="errors.endsAt" size="sm">
            <UInput
              type="datetime-local"
              name="endsAt"
              :modelValue="form.endsAt"
              class="w-full"
              @update:modelValue="emit('form', 'endsAt', String($event ?? ''))"
            />
          </UFormField>
          <UButton type="submit" class="mt-6" icon="i-lucide-badge-percent" :loading="creating">{{
            t('salePrices.add')
          }}</UButton>
        </div>
        <UAlert v-if="errors.form" color="error" variant="subtle" :title="errors.form" data-error="sale-form" />
      </template>
    </form>

    <p v-if="!rows.length" class="text-sm text-muted">{{ t('salePrices.empty') }}</p>
    <!-- relative: nhãn sr-only (absolute) của cột thao tác phải nằm trong khung cuộn, không kéo dãn trang. -->
    <div v-else class="relative overflow-x-auto rounded-lg border border-default">
      <table class="w-full text-sm">
        <thead class="bg-elevated text-xs whitespace-nowrap text-muted">
          <tr>
            <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('salePrices.variant') }}</th>
            <th scope="col" class="px-3 py-2 text-right font-medium">{{ t('products.price') }}</th>
            <th scope="col" class="px-3 py-2 text-right font-medium">{{ t('salePrices.price') }}</th>
            <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('salePrices.period') }}</th>
            <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('common.status') }}</th>
            <th v-if="canWrite" scope="col" class="px-3 py-2">
              <span class="sr-only">{{ t('common.actions') }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr
            v-for="row in rows"
            :key="row.sale.id"
            :data-sale="`${row.variant?.sku ?? row.sale.variantId}:${row.sale.status}`"
          >
            <td class="px-3 py-2 whitespace-nowrap">
              <span v-if="row.variant" class="inline-flex items-center gap-2">
                <span
                  class="size-3.5 rounded border border-default"
                  :style="{ backgroundColor: row.variant.color.hex }"
                  aria-hidden="true"
                />
                {{ row.variant.color.name }} · {{ row.variant.size.code }}
              </span>
              <span class="block font-mono text-xs text-muted">{{ row.variant?.sku ?? row.sale.variantId }}</span>
            </td>
            <td class="px-3 py-2 text-right text-muted tabular-nums">{{ format.money(row.variant?.price) }}</td>
            <td class="px-3 py-2 text-right tabular-nums">
              <UInputNumber
                v-if="isEditing(row.sale) && row.sale.status === 'UPCOMING'"
                data-field="edit-price"
                :modelValue="editing?.price"
                :min="1"
                :increment="false"
                :decrement="false"
                class="w-32"
                :ui="{ base: 'tabular-nums text-right' }"
                @update:modelValue="emit('editField', 'price', Number($event ?? 0))"
              />
              <template v-else>
                {{ format.money(row.sale.price) }}
                <span v-if="row.discount !== null" class="ml-1 text-xs text-muted">{{
                  t('salePrices.discount', { percent: row.discount })
                }}</span>
              </template>
            </td>
            <td class="min-w-40 px-3 py-2">
              <div v-if="isEditing(row.sale)" class="flex flex-wrap items-center gap-2">
                <UInput
                  v-if="row.sale.status === 'UPCOMING'"
                  type="datetime-local"
                  data-field="edit-startsAt"
                  size="sm"
                  :modelValue="editing?.startsAt"
                  @update:modelValue="emit('editField', 'startsAt', String($event ?? ''))"
                />
                <UInput
                  type="datetime-local"
                  data-field="edit-endsAt"
                  size="sm"
                  :modelValue="editing?.endsAt"
                  @update:modelValue="emit('editField', 'endsAt', String($event ?? ''))"
                />
                <span v-if="editError" class="text-xs text-error" data-error="sale-edit">{{ editError }}</span>
              </div>
              <span v-else class="tabular-nums">{{
                t('salePrices.range', {
                  from: format.dateTime(row.sale.startsAt),
                  to: format.dateTime(row.sale.endsAt),
                })
              }}</span>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <StatusBadge :color="statusColor[row.sale.status]" :label="t(`salePrices.status.${row.sale.status}`)" />
            </td>
            <td v-if="canWrite" class="px-3 py-2 text-right whitespace-nowrap">
              <template v-if="isEditing(row.sale)">
                <UButton size="xs" :loading="updating" data-action="save-sale" @click="emit('saveEdit', row.sale)">{{
                  t('common.save')
                }}</UButton>
                <UButton size="xs" color="neutral" variant="ghost" @click="emit('cancelEdit')">{{
                  t('common.cancel')
                }}</UButton>
              </template>
              <template v-else-if="row.sale.status !== 'ENDED'">
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  :data-action="`edit-sale:${row.variant?.sku}`"
                  @click="emit('edit', row.sale)"
                  >{{ row.sale.status === 'ACTIVE' ? t('salePrices.changeEnd') : t('common.edit') }}</UButton
                >
                <UButton
                  v-if="row.sale.status === 'ACTIVE'"
                  size="xs"
                  color="error"
                  variant="ghost"
                  :data-action="`end-sale:${row.variant?.sku}`"
                  @click="emit('endNow', row)"
                  >{{ t('salePrices.endNow') }}</UButton
                >
                <UButton
                  v-else
                  size="xs"
                  color="error"
                  variant="ghost"
                  :data-action="`delete-sale:${row.variant?.sku}`"
                  @click="emit('remove', row)"
                  >{{ t('common.delete') }}</UButton
                >
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
