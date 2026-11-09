<script setup lang="ts">
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import { h } from 'vue'

import { uiConfig } from '@app/config/Ui.config'
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import FilterSelect from '@shared/components/list/FilterSelect.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTable from '@shared/components/table/DataTable.vue'
import TableLink from '@shared/components/table/TableLink.vue'

/** Trang duyệt token với designer (§L.10) — chỉ đăng ký route ở dev. */
type Color = keyof typeof uiConfig.colors
const COLORS = Object.keys(uiConfig.colors) as Color[]

const SURFACES = [
  { label: 'bg-default', cls: 'bg-default' },
  { label: 'bg-muted', cls: 'bg-muted' },
  { label: 'bg-elevated', cls: 'bg-elevated' },
] as const
// DESIGN.md: chữ trạng thái đi qua badge subtle/soft; solid chỉ cho error/neutral/primary.
const STATUS_COLORS = ['success', 'warning', 'error', 'info', 'neutral', 'primary'] as const
const SOLID_COLORS = ['error', 'neutral', 'primary'] as const

// Fixture xấu nhất (tên dài, giá lớn, tồn 0) để soi bảng compact.
const ROWS = [
  {
    id: '1',
    sku: 'DAM-MIDI-0001',
    name: 'Đầm midi lụa xếp ly cổ yếm phối nơ lưng — phiên bản giới hạn Thu Đông 2026',
    price: '15.500.000 ₫',
    stock: 'Hết',
  },
  { id: '2', sku: 'AO-LINEN-0002', name: 'Áo linen', price: '250.000 ₫', stock: '12' },
]
const COLUMNS = [
  { accessorKey: 'sku', header: 'SKU', meta: { class: { td: 'font-mono text-xs' } } },
  {
    accessorKey: 'name',
    header: 'Tên',
    cell: ({ row }: { row: { original: (typeof ROWS)[number] } }) =>
      h(TableLink, { to: '/design-system', label: row.original.name }),
  },
  { accessorKey: 'price', header: 'Giá', meta: { class: { th: 'text-right', td: 'text-right tabular-nums' } } },
  { accessorKey: 'stock', header: 'Tồn', meta: { class: { th: 'text-right', td: 'text-right tabular-nums' } } },
]
const FILTER_ITEMS = [
  { label: 'Bản nháp', value: 'draft' },
  { label: 'Đã đăng', value: 'published' },
]
const SERVER_ERROR = { response: { status: 500 } }

const TEXTS = ['text-highlighted', 'text-default', 'text-muted', 'text-dimmed'] as const
</script>

<template>
  <div class="flex flex-col gap-8 p-6">
    <PageHeader title="Design system" />

    <section class="flex flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Màu ngữ nghĩa</h2>
      <div v-for="color in COLORS" :key="color" class="flex items-center gap-3">
        <span class="w-24 text-sm text-muted">{{ color }} → {{ uiConfig.colors[color] }}</span>
        <UButton :color="color">Button</UButton>
        <UButton :color="color" variant="outline">Outline</UButton>
        <UBadge :color="color">Badge</UBadge>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Nền / chữ</h2>
      <div class="flex gap-3">
        <div v-for="s in SURFACES" :key="s.label" :class="[s.cls, 'rounded-lg border border-default p-4 text-sm']">
          {{ s.label }}
        </div>
      </div>
      <p v-for="t in TEXTS" :key="t" :class="[t, 'text-sm']">{{ t }}</p>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Typography</h2>
      <p class="font-display text-3xl font-bold tabular-nums">1.234.567 ₫</p>
      <p class="text-sm">Inter — Thời trang Việt Nam, áo dài, quần jean.</p>
      <p class="font-mono text-xs">SKU-0001-VN</p>
    </section>

    <section class="flex max-w-sm flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Form</h2>
      <UInput placeholder="Tên sản phẩm" />
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Badge trạng thái</h2>
      <div class="flex flex-wrap gap-2">
        <StatusBadge v-for="color in STATUS_COLORS" :key="color" :color="color" :label="color" />
      </div>
      <div class="flex flex-wrap gap-2">
        <UBadge v-for="color in STATUS_COLORS" :key="color" :color="color" variant="soft">{{ color }} · soft</UBadge>
      </div>
      <div class="flex flex-wrap gap-2">
        <UBadge v-for="color in SOLID_COLORS" :key="color" :color="color" variant="solid">{{ color }} · solid</UBadge>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Thanh lọc</h2>
      <div class="flex flex-wrap items-end gap-3">
        <FilterSelect name="status" label="Trạng thái" :items="FILTER_ITEMS" />
        <UInput type="number" placeholder="Giá tối thiểu" class="w-32" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Bảng compact</h2>
      <DataTable :data="ROWS" :columns="COLUMNS" />
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <h2 class="font-display text-lg font-semibold md:col-span-3">State</h2>
      <div class="rounded-lg border border-default p-4"><LoadingState /></div>
      <div class="rounded-lg border border-default p-4"><EmptyState title="Chưa có dữ liệu" /></div>
      <div class="rounded-lg border border-default p-4"><ErrorState :error="SERVER_ERROR" /></div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="font-display text-lg font-semibold">Focus (bấm Tab để xem)</h2>
      <div class="flex flex-wrap items-center gap-3">
        <UButton>Nút Nuxt UI</UButton>
        <a
          href="#focus"
          class="rounded-lg border border-default px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >Link ô tự viết</a
        >
      </div>
    </section>
  </div>
</template>
