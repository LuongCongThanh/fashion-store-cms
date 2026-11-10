<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import UModal from '@nuxt/ui/components/Modal.vue'
import { ref } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ open: boolean; sku: string; pending: boolean; errors: Record<string, string> }>()
const emit = defineEmits<{ close: []; submit: [input: { quantity: number; reason: string }] }>()
const { t } = useT()
const quantity = ref(0)
const reason = ref('')
</script>

<template>
  <UModal
    :open="open"
    :title="`${t('inventory.adjust')}: ${sku}`"
    :portal="false"
    @update:open="!$event && emit('close')"
  >
    <template #body>
      <form data-stock-adjust class="space-y-4" @submit.prevent="emit('submit', { quantity, reason })">
        <UFormField :label="t('orders.quantity')" name="quantity" :error="errors.quantity">
          <UInputNumber
            :modelValue="quantity"
            name="quantity"
            data-field="quantity"
            class="w-40"
            :ui="{ base: 'tabular-nums text-right' }"
            @update:modelValue="quantity = $event ?? 0"
          />
        </UFormField>
        <UFormField :label="t('inventory.reason')" name="reason" :error="errors.reason">
          <UInput v-model="reason" name="reason" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="outline" @click="emit('close')">{{ t('common.cancel') }}</UButton>
          <UButton type="submit" :loading="pending">{{ t('common.save') }}</UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
