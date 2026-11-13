<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import { computed } from 'vue'

import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { Color } from '@features/colors/types/Color.types'
import type { VariantInput } from '@features/products/schemas/Product.schema'
import type { ProductVariant } from '@features/products/types/Product.types'
import type { Size } from '@features/sizes/types/Size.types'

const props = defineProps<{
  variants: ProductVariant[]
  sizes: Size[]
  colors: Color[]
  draft: VariantInput
  errors: Partial<Record<keyof VariantInput, string>>
  prices: Record<string, number>
  canWrite: boolean
  adding: boolean
  updating: boolean
}>()
const emit = defineEmits<{
  draft: [key: 'sizeId' | 'colorId' | 'price', value: string | number]
  sku: [value: string]
  add: []
  price: [variantId: string, value: number]
  savePrice: [variant: ProductVariant]
  archive: [variant: ProductVariant, archived: boolean]
}>()
const { t } = useT()
const format = useFormat()
const sizeItems = computed(() => props.sizes.map((size) => ({ label: `${size.code} · ${size.name}`, value: size.id })))
const colorItems = computed(() =>
  props.colors.map((color) => ({ label: `${color.code} · ${color.name}`, value: color.id })),
)
const rows = computed(() =>
  [...props.variants].sort(
    (a, b) => a.color.name.localeCompare(b.color.name, 'vi') || a.size.code.localeCompare(b.size.code),
  ),
)
const dirty = (variant: ProductVariant) =>
  props.prices[variant.id] !== undefined && props.prices[variant.id] !== variant.price
</script>

<template>
  <div class="space-y-4">
    <p v-if="!variants.length" class="text-sm text-muted">{{ t('products.noVariants') }}</p>
    <!-- relative: nhãn sr-only (absolute) của cột thao tác phải nằm trong khung cuộn, không kéo dãn trang. -->
    <div v-else class="relative overflow-x-auto rounded-lg border border-default">
      <table class="w-full text-sm">
        <thead class="bg-elevated text-xs text-muted">
          <tr>
            <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('products.color') }}</th>
            <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('products.size') }}</th>
            <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('products.sku') }}</th>
            <th scope="col" class="px-3 py-2 text-right font-medium">{{ t('products.price') }}</th>
            <th scope="col" class="px-3 py-2 text-left font-medium">{{ t('common.status') }}</th>
            <th v-if="canWrite" scope="col" class="px-3 py-2">
              <span class="sr-only">{{ t('common.actions') }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr v-for="variant in rows" :key="variant.id" :data-variant="variant.sku">
            <td class="px-3 py-2 whitespace-nowrap">
              <span class="inline-flex items-center gap-2">
                <span
                  class="size-3.5 rounded border border-default"
                  :style="{ backgroundColor: variant.color.hex }"
                  aria-hidden="true"
                />
                {{ variant.color.name }}
              </span>
            </td>
            <td class="px-3 py-2">{{ variant.size.code }}</td>
            <td class="px-3 py-2 font-mono">{{ variant.sku }}</td>
            <td class="px-3 py-2 text-right tabular-nums">
              <div v-if="canWrite && variant.status === 'ACTIVE'" class="flex items-center justify-end gap-2">
                <UInputNumber
                  :name="`price:${variant.sku}`"
                  :data-field="`price:${variant.sku}`"
                  :modelValue="prices[variant.id] ?? variant.price"
                  :min="1"
                  :increment="false"
                  :decrement="false"
                  :aria-label="`${t('products.price')} ${variant.sku}`"
                  class="w-36"
                  :ui="{ base: 'tabular-nums text-right' }"
                  @update:modelValue="emit('price', variant.id, Number($event ?? 0))"
                />
                <UButton
                  v-if="dirty(variant)"
                  size="xs"
                  :loading="updating"
                  :data-action="`save-price:${variant.sku}`"
                  @click="emit('savePrice', variant)"
                  >{{ t('common.save') }}</UButton
                >
              </div>
              <span v-else>{{ format.money(variant.price) }}</span>
            </td>
            <td class="px-3 py-2">
              <StatusBadge
                :color="variant.status === 'ACTIVE' ? 'success' : 'neutral'"
                :label="t(`products.variantStatus.${variant.status}`)"
              />
            </td>
            <td v-if="canWrite" class="px-3 py-2 text-right">
              <UButton
                size="xs"
                color="neutral"
                variant="ghost"
                :disabled="updating"
                :data-action="`${variant.status === 'ACTIVE' ? 'archive' : 'unarchive'}:${variant.sku}`"
                @click="emit('archive', variant, variant.status === 'ACTIVE')"
                >{{ variant.status === 'ACTIVE' ? t('products.stopSelling') : t('products.sellAgain') }}</UButton
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <form
      v-if="canWrite"
      class="grid items-start gap-3 rounded-lg border border-dashed border-default p-4 sm:grid-cols-[1fr_1fr_1.4fr_1fr_auto]"
      data-form="add-variant"
      @submit.prevent="emit('add')"
    >
      <UFormField :label="t('products.color')" name="colorId" :error="errors.colorId" size="sm">
        <USelect
          :modelValue="draft.colorId || undefined"
          :items="colorItems"
          :placeholder="t('products.chooseColor')"
          class="w-full"
          @update:modelValue="emit('draft', 'colorId', String($event ?? ''))"
        />
      </UFormField>
      <UFormField :label="t('products.size')" name="sizeId" :error="errors.sizeId" size="sm">
        <USelect
          :modelValue="draft.sizeId || undefined"
          :items="sizeItems"
          :placeholder="t('products.chooseSize')"
          class="w-full"
          @update:modelValue="emit('draft', 'sizeId', String($event ?? ''))"
        />
      </UFormField>
      <UFormField :label="t('products.sku')" name="sku" :error="errors.sku" :hint="t('products.skuHint')" size="sm">
        <UInput
          name="sku"
          :modelValue="draft.sku"
          class="w-full"
          :ui="{ base: 'font-mono' }"
          @update:modelValue="emit('sku', String($event ?? ''))"
        />
      </UFormField>
      <UFormField :label="t('products.price')" name="price" :error="errors.price" size="sm">
        <UInputNumber
          name="price"
          data-field="price"
          :modelValue="draft.price || undefined"
          :min="1"
          :increment="false"
          :decrement="false"
          class="w-full"
          :ui="{ base: 'tabular-nums text-right' }"
          @update:modelValue="emit('draft', 'price', Number($event ?? 0))"
        />
      </UFormField>
      <UButton type="submit" class="mt-6" icon="i-lucide-plus" :loading="adding">{{
        t('products.addVariant')
      }}</UButton>
    </form>
  </div>
</template>
