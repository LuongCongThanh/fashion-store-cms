<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'

import { useUsersQuery } from '../api/Users.api'
import UserFilters from '../components/UserFilters.vue'
import UserTable from '../components/UserTable.vue'
import { userListSchema } from '../schemas/User.schema'
const router = useRouter()
const { t } = useT()
const { can } = useAuth()
const { params, setFilter, setPage, setSort } = useListState(userListSchema)
const query = useUsersQuery(params)
</script>
<template>
  <div class="space-y-4">
    <PageHeader :title="t('users.title')">
      <template #actions>
        <UButton v-if="can('user:write')" to="/users/new">{{ t('common.create') }}</UButton>
      </template>
    </PageHeader>
    <UserFilters
      :search="params.search"
      :status="params.status"
      :roleId="params.roleId"
      @filter="setFilter"
    />
    <UserTable
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :sort="params.sort"
      :canWrite="can('user:write')"
      @sort="setSort"
      @retry="query.refetch()"
      @action="(_action, id) => router.push(`/users/${encodeURIComponent(id)}/edit`)"
    />
    <DataTablePagination
      :meta="query.data.value?.meta"
      @page="setPage"
      @pageSize="setFilter('pageSize', $event)"
    />
  </div>
</template>
