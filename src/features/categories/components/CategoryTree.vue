<script setup lang="ts">
import UBadge from '@nuxt/ui/components/Badge.vue'
import { computed } from 'vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { Category } from '@features/categories/types/Category.types'
const props = defineProps<{ items: Category[]; canWrite: boolean; pending?: boolean }>()
const emit = defineEmits<{ move: [id: string, parentId: string | null] }>()
const { t } = useT()
const rows = computed(() => {
  const ordered: { item: Category; depth: number }[] = []
  const seen = new Set<string>()
  function append(parentId: string | null, depth: number) {
    const children = props.items
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'vi'))
    for (const item of children) {
      if (seen.has(item.id)) continue
      seen.add(item.id)
      ordered.push({ item, depth })
      append(item.id, depth + 1)
    }
  }
  append(null, 0)
  for (const item of props.items) if (!seen.has(item.id)) ordered.push({ item, depth: 0 })
  return ordered
})
function drop(event: DragEvent, parentId: string | null) {
  if (!props.canWrite || props.pending) return
  const id = event.dataTransfer?.getData('text/plain')
  if (!id || id === parentId) return
  let parent = parentId
  const seen = new Set<string>()
  while (parent && !seen.has(parent)) {
    if (parent === id) return
    seen.add(parent)
    parent = props.items.find((item) => item.id === parent)?.parentId ?? null
  }
  emit('move', id, parentId)
}
</script>

<template>
  <div role="tree" :aria-label="t('products.category')">
    <div v-if="canWrite" class="rounded border border-dashed p-3" @dragover.prevent @drop.prevent="drop($event, null)">
      {{ t('categories.root') }}
    </div>
    <div
      v-for="row in rows"
      :key="row.item.id"
      role="treeitem"
      :aria-level="row.depth + 1"
      :data-category="row.item.id"
      :data-parent="row.item.parentId ?? ''"
      :draggable="canWrite && !pending"
      :style="{ paddingLeft: `${row.depth * 24 + 12}px` }"
      class="border-b border-default p-3"
      @dragstart="$event.dataTransfer?.setData('text/plain', row.item.id)"
      @dragover.prevent
      @drop.prevent.stop="drop($event, row.item.id)"
    >
      <span>{{ row.item.name }}</span>
      <UBadge v-if="!row.item.isVisible" color="neutral" variant="subtle" class="ml-2">
        {{ t('categories.hidden') }}
      </UBadge>
      <RouterLink
        v-if="canWrite"
        :to="`/categories/${encodeURIComponent(row.item.id)}/edit`"
        class="ml-4 text-primary"
        >{{ t('common.edit') }}</RouterLink
      >
    </div>
  </div>
</template>
