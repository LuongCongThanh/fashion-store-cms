<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UEmpty from '@nuxt/ui/components/Empty.vue'
import { computed } from 'vue'

import { messageKeyOf } from '@shared/lib/api/errors/ErrorPolicy'

/** Lỗi query hiển thị tại chỗ + nút Retry (§O.4, §21). Không bao giờ hiển thị message thô của BE. */
const props = defineProps<{ error: unknown }>()
const emit = defineEmits<{ retry: [] }>()

// Plan 08 thay bằng t(messageKeyOf(error, te)) của i18n.
const message = computed(() => messageKeyOf(props.error, () => false))
</script>

<template>
  <UEmpty icon="i-lucide-circle-alert" :title="message">
    <template #actions>
      <UButton data-action="retry" icon="i-lucide-rotate-cw" @click="emit('retry')"
        >Thử lại</UButton
      >
    </template>
  </UEmpty>
</template>
