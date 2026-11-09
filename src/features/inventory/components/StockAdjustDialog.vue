<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
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
      <form
        data-stock-adjust
        class="space-y-3"
        @submit.prevent="emit('submit', { quantity, reason })"
      >
        <label
          >{{ t('orders.quantity')
          }}<input v-model.number="quantity" type="number" name="quantity" />
        </label>
        <p v-if="errors.quantity" role="alert">{{ errors.quantity }}</p>
        <label>{{ t('inventory.reason') }}<input v-model="reason" name="reason" /> </label>
        <p v-if="errors.reason" role="alert">{{ errors.reason }}</p>
        <UButton type="submit" :loading="pending">{{ t('common.save') }}</UButton>
        <UButton variant="outline" @click="emit('close')">{{ t('common.cancel') }}</UButton>
      </form>
    </template>
  </UModal>
</template>
