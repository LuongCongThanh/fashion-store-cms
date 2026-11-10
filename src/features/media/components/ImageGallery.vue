<script setup lang="ts">
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue'

import { useConfirm } from '@shared/components/confirm/UseConfirm'
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { MediaImage } from '@features/media/types/Media.types'
const props = defineProps<{ images: MediaImage[]; mainId?: string; readonly?: boolean }>()
const emit = defineEmits<{
  remove: [id: string]
  main: [id: string]
  move: [id: string, offset: number]
}>()
const { t } = useT()
const confirm = useConfirm()
async function remove(image: MediaImage) {
  if (
    await confirm({
      title: t('media.deleteTitle'),
      description: t('media.deleteDescription', { name: image.name }),
      confirmLabel: t('common.delete'),
      color: 'error',
    })
  )
    emit('remove', image.id)
}
function actions(image: MediaImage, index: number) {
  return [
    {
      label: t('media.main'),
      disabled: props.mainId === image.id,
      onSelect: () => {
        emit('main', image.id)
      },
    },
    {
      label: t('media.moveLeft'),
      disabled: index === 0,
      onSelect: () => {
        emit('move', image.id, -1)
      },
    },
    {
      label: t('media.moveRight'),
      disabled: index === props.images.length - 1,
      onSelect: () => {
        emit('move', image.id, 1)
      },
    },
    {
      label: t('common.delete'),
      color: 'error' as const,
      onSelect: () => {
        void remove(image)
      },
    },
  ]
}
</script>

<template>
  <EmptyState v-if="!images.length" :title="t('common.empty')" />
  <ul v-else class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
    <li v-for="(image, index) in images" :key="image.id" class="min-w-0 space-y-2">
      <img :src="image.url" :alt="image.name" class="aspect-[3/4] w-full rounded-lg object-cover" loading="lazy" />
      <div class="flex items-center justify-between gap-2">
        <UBadge v-if="mainId === image.id" variant="subtle">{{ t('media.mainImage') }}</UBadge>
        <UDropdownMenu v-if="!readonly" :items="actions(image, index)">
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-ellipsis"
            :aria-label="t('media.actions', { name: image.name })"
            class="ms-auto"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
</template>
