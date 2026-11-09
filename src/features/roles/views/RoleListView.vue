<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useAuth } from '@features/auth/UseAuth'
import { useRolesQuery } from '@features/roles/api/Roles.api'
import RoleTable from '@features/roles/components/RoleTable.vue'
import { roleListSchema } from '@features/roles/schemas/Role.schema'
import FilterBar from '@shared/components/list/FilterBar.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import DataTableToolbar from '@shared/components/table/DataTableToolbar.vue'
import { useListState } from '@shared/composables/UseListState'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'
const { t, tn } = useT()
const format = useFormat()
const { can } = useAuth()
const { params, setFilter, setPage, setSort } = useListState(roleListSchema)
const query = useRolesQuery(params)
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('roles.title')">
      <template #actions>
        <UButton v-if="can('role:write')" to="/roles/new">{{ t('common.create') }}</UButton>
      </template>
    </PageHeader>
    <FilterBar>
      <ListSearch :modelValue="params.search" @update:modelValue="setFilter('search', $event)" />
    </FilterBar>
    <DataTableToolbar
      :title="
        tn('common.results', query.data.value?.meta.total ?? 0, { n: format.number(query.data.value?.meta.total ?? 0) })
      "
      :count="0"
    />
    <RoleTable
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :sort="params.sort"
      :canWrite="can('role:write')"
      @sort="setSort"
      @retry="query.refetch()"
    />
    <DataTablePagination :meta="query.data.value?.meta" @page="setPage" @pageSize="setFilter('pageSize', $event)" />
  </div>
</template>
