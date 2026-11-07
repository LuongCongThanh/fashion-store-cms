<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UModal from '@nuxt/ui/components/Modal.vue'

import { useT } from '@shared/lib/i18n/I18n'

const props = defineProps<{
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  color?: 'error' | 'primary'
}>()
const emit = defineEmits<{ close: [confirmed: boolean] }>()

const { t } = useT()
</script>

<template>
  <UModal
    :title="props.title"
    :description="props.description"
    :dismissible="true"
    @update:open="(open: boolean) => !open && emit('close', false)"
  >
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="emit('close', false)">
          {{ props.cancelLabel ?? t('common.cancel') }}
        </UButton>
        <UButton :color="props.color ?? 'primary'" @click="emit('close', true)">
          {{ props.confirmLabel ?? t('common.confirm') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
