<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
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
function update(index: number, key: 'sku' | 'price' | 'stock', event: Event) {
  const text = (event.target as HTMLInputElement).value
  emit(
    'update:modelValue',
    props.modelValue.map((variant, i) =>
      i === index ? { ...variant, [key]: key === 'sku' ? text : Number(text) } : variant,
    ),
  )
}
</script>
<template>
  <div class="space-y-3">
    <div class="flex flex-wrap gap-3">
      <label>{{ t('products.sizes') }}<input v-model="sizes" name="sizes" /> </label>
      <label>{{ t('products.colors') }}<input v-model="colors" name="colors" /> </label>
      <label>SKU<input v-model="prefix" name="skuPrefix" /> </label>
      <UButton
        type="button"
        @click="emit('update:modelValue', generateVariants(sizes.split(','), colors.split(','), prefix, price, 0))"
        >{{ t('products.generate') }}</UButton
      >
    </div>
    <table class="w-full">
      <thead>
        <tr>
          <th>{{ t('products.variant') }}</th>
          <th>SKU</th>
          <th>{{ t('products.price') }}</th>
          <th>{{ t('products.stock') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(variant, index) in modelValue" :key="index">
          <td>{{ variant.size }} {{ variant.color }}</td>
          <td v-for="key in ['sku', 'price', 'stock'] as const" :key="key">
            <input
              :name="`variants.${index}.${key}`"
              :type="key === 'sku' ? 'text' : 'number'"
              min="0"
              :value="variant[key]"
              @input="update(index, key, $event)"
            />
            <span v-if="errors[`variants.${index}.${key}`]" role="alert">{{ errors[`variants.${index}.${key}`] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
