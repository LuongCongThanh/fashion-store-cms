<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useAuth } from '@features/auth/UseAuth'
import { useSizesQuery } from '@features/sizes/api/Sizes.api'
import SizeTable from '@features/sizes/components/SizeTable.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const { t } = useT()
const { can } = useAuth()
const query = useSizesQuery()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('sizes.title')" :description="t('sizes.description')">
      <template #actions>
        <UButton v-if="can('CATALOG_PRODUCT_OPTION_MANAGE')" to="/sizes/new">{{ t('common.create') }}</UButton>
      </template>
    </PageHeader>
    <SizeTable
      :data="query.data.value ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :canWrite="can('CATALOG_PRODUCT_OPTION_MANAGE')"
      @retry="query.refetch()"
    />
  </div>
</template>
