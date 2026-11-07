<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UEmpty from '@nuxt/ui/components/Empty.vue'
import { computed } from 'vue'

import { messageKeyOf } from '@shared/lib/api/errors/ErrorPolicy'
import { useT } from '@shared/lib/i18n/I18n'

import type { MessageKey } from '@shared/lib/i18n/I18n'

/** Lỗi query hiển thị tại chỗ + nút Retry (§O.4, §21). Không bao giờ hiển thị message thô của BE. */
const props = defineProps<{ error: unknown }>()
const emit = defineEmits<{ retry: [] }>()

const { t, te } = useT()
// Key động (errors.<code>) — messageKeyOf đảm bảo key tồn tại.
const message = computed(() => t(messageKeyOf(props.error, te) as MessageKey))
</script>

<template>
  <UEmpty icon="i-lucide-circle-alert" :title="message">
    <template #actions>
      <UButton data-action="retry" icon="i-lucide-rotate-cw" @click="emit('retry')">
        {{ t('common.retry') }}
      </UButton>
    </template>
  </UEmpty>
</template>
