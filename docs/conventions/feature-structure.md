# Tổ chức một feature

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## Khung feature mới (copy tay, chưa có generator)

```text
features/<name>/
├── api/<Feature>.api.ts
├── schemas/<Entity>.schema.ts
├── types/<Entity>.types.ts
├── components/<Entity>Table.vue
├── views/<Entity>ListView.vue
└── Use<Feature>.ts            # chỉ khi feature khác cần dùng
```

Component mẫu:

```vue
<script setup lang="ts">
import type { Product } from '@features/products/types/Product.types'

const props = defineProps<{ items: Product[]; loading?: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <UTable :data="props.items" :loading="props.loading" />
</template>
```

Spec mẫu (`<File>.spec.ts`): `describe` theo tên module, `it` mô tả hành vi bằng tiếng Anh (`it('redirects to login when unauthenticated')`).

---

## Khung chuẩn một feature

- `<Feature>`: tên feature dạng PascalCase, **số nhiều** như tên thư mục (`Products`, `Orders`) — dùng cho `api`, `routes`, `Use*`.
- `<Entity>`: tên thực thể **số ít** (`Product`, `Order`) — dùng cho `schemas`, `types`, `components`, `views`.
- Feature không đếm được giữ nguyên: `Auth`, `Dashboard`, `Inventory`, `Media`.

Mọi feature theo đúng khung này; thư mục con nào chưa có file thì chưa tạo.

```text
features/<name>/
├── api/
│   ├── <Entity>.mapper.ts         # CHỈ khi DTO lệch Model (§T.3)
│   ├── <Entity>.mapper.spec.ts
│   ├── <Feature>.api.ts           # hàm HTTP + query key (nội bộ) + composable Vue Query trả Model (export)
│   └── <Feature>.api.spec.ts      # test invalidate, map params
├── components/                 # presentational: props in / emits out, không gọi API (§T.1)
│   ├── <Entity>Form.vue
│   ├── <Entity>Form.spec.ts
│   ├── <Entity>StatusBadge.vue   # map trạng thái → màu (§L.4)
│   ├── <Entity>Table.vue
│   └── <Entity>Table.spec.ts
├── composables/                # logic màn hình (§T.1) — tách khi ≥ 2 view dùng hoặc logic đủ dày
│   ├── Use<Entity>Actions.ts     # xoá/đổi trạng thái: confirm + mutation + toast
│   ├── Use<Entity>Form.ts        # schema + mutation + applyApiErrorToForm
│   └── Use<Entity>Form.spec.ts
├── schemas/
│   ├── <Entity>.schema.ts        # Zod: form + list params
│   └── <Entity>.schema.spec.ts
├── types/
│   └── <Entity>.types.ts         # Model của FE — KHÔNG alias DTO (§T.3)
├── views/                      # container, route module của feature lazy-import
│   ├── <Entity>CreateView.vue
│   ├── <Entity>DetailView.vue
│   ├── <Entity>EditView.vue
│   └── <Entity>ListView.vue
├── <Feature>.routes.ts            # mảng RouteRecordRaw của feature, Routes.ts gộp lại
├── Use<Feature>.ts                # chỉ khi feature khác cần dùng
└── Use<Feature>.spec.ts
```

`<Feature>.routes.ts` thêm vào whitelist [§B.3](module-boundaries.md) (chỉ `app/router/Routes.ts` được import), để route của feature nằm cùng feature và lazy-import `./views/...` bằng đường dẫn tương đối.

**Feature tối thiểu** = `api/` + `types/` + `views/` (+ `<Feature>.routes.ts`); mọi thư mục khác thêm khi cần. Tầng tuỳ chọn: `composables/` và `*.mapper.ts` chỉ tạo khi có lý do (quy tắc ≥ 2 nơi dùng áp dụng cả trong feature; mapper khi DTO lệch Model). Ban đầu view gọi thẳng composable của `api/`.

Thứ tự phụ thuộc bên trong feature ([§T.1](../architecture/data-flow.md)): `views → components` (props/emits) và `views → [composables] → api → [mapper] → types`; `components` chỉ import `types/`, `schemas/`, `@shared/components`; `stores/` (nếu có) chỉ `api/` và `Use<Feature>.ts` dùng.

## Từng feature

Đọc inventory trực tiếp ở [`src/features`](../../src/features). Cây module mẫu dưới đây không phải danh sách file bắt buộc:

- `products` sở hữu editor/list/variants/sale prices và upload ảnh theo màu; upload tại `api/ProductImages.api.ts`, không còn `features/media`.
- `categories`, `sizes`, `colors`, `vouchers`, `accounts` và `roles` có route module riêng, quyền theo Generated API tại các phần đã nối contract.
- `orders`, `inventory`, `customers`, `dashboard`, `settings` giữ phạm vi/readiness theo [restructure plan](../plan/initiatives/api-restructure/map.md); không suy từ sự tồn tại của UI rằng đã tích hợp đầy đủ.
- `auth` sở hữu thông tin tài khoản/quyền; token lifecycle ở Session, nối bằng runtime ([§M](../architecture/http-session.md)).

Không tạo `MediaLibraryView`, StoreScope, Promotions hoặc Users theo cây scaffold cũ. URL hiện tại ở [navigation-flow](../architecture/navigation.md). Cây workflow đích và mapping triển khai thuộc [migration](../plan/initiatives/structure-migration/map.md), chỉ áp sau khi slice tương ứng chuyển source.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../README.md).
