<script setup lang="ts">
import { useAuth } from '@features/auth/UseAuth'
import { useCategoriesQuery, useMoveCategoryMutation } from '@features/categories/api/Categories.api'
import CategoryTree from '@features/categories/components/CategoryTree.vue'
import CategoryTreeToolbar from '@features/categories/components/CategoryTreeToolbar.vue'
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const { t } = useT()
const { can } = useAuth()
const query = useCategoriesQuery()
const mutation = useMoveCategoryMutation()
function move(id: string, parentId: string | null) {
  if (can('category:write')) mutation.mutate({ id, parentId })
}
</script>
<template>
  <div class="space-y-4">
    <PageHeader :title="t('products.category')">
      <template #actions>
        <CategoryTreeToolbar :canWrite="can('category:write')" />
      </template>
    </PageHeader>
    <LoadingState v-if="query.isPending.value" />
    <ErrorState v-else-if="query.isError.value" :error="query.error.value" @retry="query.refetch()" />
    <CategoryTree
      v-else-if="query.data.value?.length"
      :items="query.data.value"
      :canWrite="can('category:write')"
      :pending="mutation.isPending.value"
      @move="move"
    />
    <EmptyState v-else :title="t('common.empty')" />
  </div>
</template>
