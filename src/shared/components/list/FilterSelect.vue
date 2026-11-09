<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import { computed } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'

/**
 * Select của thanh lọc: label hiển thị + option "Tất cả".
 * reka-ui không cho option có value rỗng, nên "Tất cả" dùng giá trị riêng và được đổi về '' khi emit.
 */
const props = defineProps<{
  label: string
  name: string
  modelValue?: string | null
  items: { label: string; value: string }[]
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { t } = useT()

const ALL = '__all__'
const options = computed(() => [{ label: t('common.all'), value: ALL }, ...props.items])
const selected = computed(() => props.modelValue || ALL)
</script>

<template>
  <UFormField :label="label" :name="name" size="sm" class="min-w-40">
    <USelect
      :modelValue="selected"
      :items="options"
      class="w-full"
      @update:modelValue="emit('update:modelValue', $event === ALL ? '' : String($event))"
    />
  </UFormField>
</template>
