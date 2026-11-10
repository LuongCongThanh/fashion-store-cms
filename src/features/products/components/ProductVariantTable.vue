<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import { ref } from 'vue'

import { generateVariants } from '@features/products/schemas/Variants'
import { useT } from '@shared/lib/i18n/I18n'

import type { ProductInput } from '@features/products/schemas/Product.schema'
const props = defineProps<{
  modelValue: ProductInput['variants']
  price: number
  errors: Record<string, string | undefined>
}>()
const emit = defineEmits<{ 'update:modelValue': [value: ProductInput['variants']] }>()
const { t } = useT()
const sizes = ref('')
const colors = ref('')
const prefix = ref('')
type Variant = ProductInput['variants'][number]
function update<K extends 'sku' | 'price' | 'stock'>(index: number, key: K, value: Variant[K]) {
  emit(
    'update:modelValue',
    props.modelValue.map((variant, i) => (i === index ? { ...variant, [key]: value } : variant)),
  )
}
function fieldName(index: number, key: string) {
  return `variants.${index}.${key}`
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end gap-3">
      <UFormField :label="t('products.sizes')" name="sizes" size="sm">
        <UInput v-model="sizes" name="sizes" :placeholder="t('products.sizesPlaceholder')" />
      </UFormField>
      <UFormField :label="t('products.colors')" name="colors" size="sm">
        <UInput v-model="colors" name="colors" />
      </UFormField>
      <UFormField :label="t('products.skuPrefix')" name="skuPrefix" size="sm">
        <UInput v-model="prefix" name="skuPrefix" class="font-mono" />
      </UFormField>
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        size="sm"
        @click="emit('update:modelValue', generateVariants(sizes.split(','), colors.split(','), prefix, price, 0))"
        >{{ t('products.generate') }}</UButton
      >
    </div>
    <div v-if="modelValue.length" class="overflow-x-auto rounded-lg border border-default">
      <table class="w-full text-sm">
        <thead class="bg-elevated text-xs text-muted">
          <tr>
            <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('products.variant') }}</th>
            <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('products.sku') }}</th>
            <th scope="col" class="px-3 py-2 text-right font-medium">{{ t('products.price') }}</th>
            <th scope="col" class="px-3 py-2 text-right font-medium">{{ t('products.stock') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr v-for="(variant, index) in modelValue" :key="index">
            <th scope="row" class="px-3 py-1.5 text-left font-normal whitespace-nowrap">
              {{ variant.size }} {{ variant.color }}
            </th>
            <td class="px-3 py-1.5 align-top">
              <UFormField :name="fieldName(index, 'sku')" :error="errors[fieldName(index, 'sku')]" size="sm">
                <UInput
                  :name="fieldName(index, 'sku')"
                  :modelValue="variant.sku"
                  :aria-label="`${variant.size} ${variant.color} ${t('products.sku')}`"
                  class="w-full"
                  :ui="{ base: 'font-mono' }"
                  @update:modelValue="update(index, 'sku', String($event))"
                />
              </UFormField>
            </td>
            <td v-for="key in ['price', 'stock'] as const" :key="key" class="px-3 py-1.5 align-top">
              <UFormField :name="fieldName(index, key)" :error="errors[fieldName(index, key)]" size="sm">
                <UInputNumber
                  :name="fieldName(index, key)"
                  :data-field="fieldName(index, key)"
                  :min="0"
                  :stepSnapping="key === 'stock'"
                  :formatOptions="{ maximumFractionDigits: key === 'price' ? 20 : 0 }"
                  :modelValue="variant[key]"
                  :increment="false"
                  :decrement="false"
                  :aria-label="`${variant.size} ${variant.color} ${t(`products.${key}`)}`"
                  class="w-full"
                  :ui="{ base: 'tabular-nums text-right' }"
                  @update:modelValue="update(index, key, $event ?? 0)"
                />
              </UFormField>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
