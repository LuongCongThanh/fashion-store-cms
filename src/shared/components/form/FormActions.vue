<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ pending?: boolean; draft?: boolean }>()
const emit = defineEmits<{ cancel: []; draft: [] }>()
const { t } = useT()
</script>
<template>
  <footer class="sticky bottom-0 flex justify-end gap-3 border-t border-default bg-default p-4">
    <UButton type="button" :disabled="pending" variant="outline" @click="emit('cancel')">{{
      t('common.cancel')
    }}</UButton
    ><UButton
      v-if="draft"
      data-action="save-draft"
      type="button"
      :disabled="pending"
      variant="soft"
      @click="emit('draft')"
      >{{ t('common.saveDraft') }}</UButton
    ><UButton type="submit" :loading="pending">{{ t('common.save') }}</UButton>
  </footer>
</template>
