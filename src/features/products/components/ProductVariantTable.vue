<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
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
function update(index: number, key: 'sku' | 'price' | 'stock', value: string | number | null | undefined) {
  const text = String(value ?? '')
  emit(
    'update:modelValue',
    props.modelValue.map((variant, i) =>
      i === index ? { ...variant, [key]: key === 'sku' ? text : Number(text) } : variant,
    ),
  )
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end gap-3">
      <UFormField :label="t('products.sizes')" name="sizes" size="sm">
        <UInput v-model="sizes" name="sizes" placeholder="S,M,L" />
      </UFormField>
      <UFormField :label="t('products.colors')" name="colors" size="sm">
        <UInput v-model="colors" name="colors" />
      </UFormField>
      <UFormField label="SKU" name="skuPrefix" size="sm">
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
            <th scope="col" class="px-3 py-2 text-left font-medium">SKU</th>
            <th scope="col" class="px-3 py-2 text-right font-medium">{{ t('products.price') }}</th>
            <th scope="col" class="px-3 py-2 text-right font-medium">{{ t('products.stock') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr v-for="(variant, index) in modelValue" :key="index">
            <th scope="row" class="px-3 py-1.5 text-left font-normal whitespace-nowrap">
              {{ variant.size }} {{ variant.color }}
            </th>
            <td v-for="key in ['sku', 'price', 'stock'] as const" :key="key" class="px-3 py-1.5 align-top">
              <UFormField :name="`variants.${index}.${key}`" :error="errors[`variants.${index}.${key}`]" size="sm">
                <UInput
                  :name="`variants.${index}.${key}`"
                  :type="key === 'sku' ? 'text' : 'number'"
                  min="0"
                  :modelValue="String(variant[key])"
                  :aria-label="`${variant.size} ${variant.color} ${key === 'sku' ? 'SKU' : t(`products.${key}`)}`"
                  class="w-full"
                  :ui="{ base: key === 'sku' ? 'font-mono' : 'tabular-nums text-right' }"
                  @update:modelValue="update(index, key, $event)"
                />
              </UFormField>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
