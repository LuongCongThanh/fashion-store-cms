<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useAuth } from '@features/auth/UseAuth'
import { useColorsQuery } from '@features/colors/api/Colors.api'
import ColorTable from '@features/colors/components/ColorTable.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import { useT } from '@shared/lib/i18n/I18n'
const { t } = useT()
const { can } = useAuth()
const query = useColorsQuery()
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('colors.title')" :description="t('colors.description')">
      <template #actions>
        <UButton v-if="can('CATALOG_PRODUCT_OPTION_MANAGE')" to="/colors/new">{{ t('common.create') }}</UButton>
      </template>
    </PageHeader>
    <ColorTable
      :data="query.data.value ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :canWrite="can('CATALOG_PRODUCT_OPTION_MANAGE')"
      @retry="query.refetch()"
    />
  </div>
</template>
