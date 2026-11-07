<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UModal from '@nuxt/ui/components/Modal.vue'

const props = defineProps<{
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  color?: 'error' | 'primary'
}>()
const emit = defineEmits<{ close: [confirmed: boolean] }>()
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
          {{ props.cancelLabel ?? 'Huỷ' }}
        </UButton>
        <UButton :color="props.color ?? 'primary'" @click="emit('close', true)">
          {{ props.confirmLabel ?? 'Xác nhận' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
