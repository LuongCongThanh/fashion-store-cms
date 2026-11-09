import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { z } from 'zod'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import LoadingState from '@shared/components/feedback/LoadingState.vue'
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import FilterBar from '@shared/components/list/FilterBar.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useListState } from '@shared/composables/UseListState'
import { renderWithPlugins } from '@test/Render'

import DataTable from './DataTable.vue'
import DataTableBulkActions from './DataTableBulkActions.vue'
import DataTableColumnVisibility from './DataTableColumnVisibility.vue'
import DataTablePagination from './DataTablePagination.vue'
import RowActions from './RowActions.vue'

type Item = { id: string; name: string }

it('lets a list View sort, paginate, select and hide columns using controlled table state', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/list', component: { render: () => null } }],
  })
  await router.push('/list')
  const View = defineComponent({
    setup() {
      const { params, setPage, setSort, setFilter } = useListState(
        z.object({
          page: z.coerce.number().default(1),
          pageSize: z.coerce.number().default(20),
          sort: z.string().default('name'),
          search: z.string().default(''),
        }),
      )
      const selection = ref<Record<string, boolean>>({})
      const visibility = ref<Record<string, boolean>>({})
      const action = ref('')
      const columns: TableColumn<Item>[] = [
        {
          id: 'select',
          header: 'Select',
          cell: ({ row }) =>
            h('input', {
              type: 'checkbox',
              name: `select:${row.original.id}`,
              checked: row.getIsSelected(),
              onChange: (event: Event) => {
                row.toggleSelected((event.target as HTMLInputElement).checked)
              },
            }),
        },
        {
          accessorKey: 'name',
          header: ({ column }) =>
            h(
              'button',
              {
                onClick: () => {
                  column.toggleSorting()
                },
              },
              'Name',
            ),
        },
        {
          id: 'actions',
          header: 'Actions',
          cell: () =>
            h(RowActions, {
              actions: [
                { id: 'view', label: 'View', allowed: true },
                { id: 'edit', label: 'Edit', allowed: false },
              ],
              onAction: (id) => {
                action.value = id
              },
            }),
        },
      ]
      return () =>
        h('main', [
          h(FilterBar, {}, () =>
            h(ListSearch, {
              modelValue: params.value.search,
              'onUpdate:modelValue': (value) => void setFilter('search', value),
            }),
          ),
          h(StatusBadge, { label: 'Published', color: 'success' }),
          h(DataTableColumnVisibility, {
            columns: [{ id: 'name', label: 'Name' }],
            modelValue: visibility.value,
            'onUpdate:modelValue': (value) => {
              visibility.value = value
            },
          }),
          h(DataTable<Item>, {
            data: [{ id: 'p1', name: 'Áo' }],
            columns,
            sort: params.value.sort,
            selection: selection.value,
            visibility: visibility.value,
            onSort: (value) => void setSort(value),
            'onUpdate:selection': (value) => {
              selection.value = value
            },
          }),
          h(
            DataTableBulkActions,
            { count: Object.values(selection.value).filter(Boolean).length, 'data-bulk': '' },
            () => 'Bulk actions',
          ),
          h(DataTablePagination, {
            meta: { page: params.value.page, pageSize: 20, total: 40, totalPages: 2 },
            onPage: (page) => void setPage(page),
          }),
          h('output', action.value),
        ])
    },
  })
  const { wrapper } = renderWithPlugins(View, { router, mount: { attachTo: document.body } })
  await wrapper.find('th button').trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.query.sort).toBe('-name')
  await wrapper.find('input[name="select:p1"]').setValue(true)
  expect(wrapper.find('[data-bulk]').text()).toContain('1 đã chọn')
  await wrapper.find('button[aria-label="Trang sau"]').trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.query.page).toBe('2')
  await wrapper.find('summary').trigger('click')
  await wrapper.find('details input[type="checkbox"]').setValue(false)
  expect(wrapper.find('thead').text()).not.toContain('Name')
})

it('shows a list error with retry, then renders an empty table and loading placeholder', async () => {
  const View = defineComponent({
    setup() {
      const failed = ref(true)
      return () =>
        h('main', [
          h(DataTable<Item>, {
            data: [],
            columns: [{ accessorKey: 'name', header: 'Name' }],
            error: failed.value ? new Error('failed') : undefined,
            onRetry: () => {
              failed.value = false
            },
          }),
          h(LoadingState),
        ])
    },
  })
  const { wrapper } = renderWithPlugins(View)
  expect(wrapper.find('[data-action="retry"]').exists()).toBe(true)
  await wrapper.find('[data-action="retry"]').trigger('click')
  expect(wrapper.text()).toContain('Chưa có dữ liệu')
  expect(wrapper.find('[role="status"]').exists()).toBe(true)
})
