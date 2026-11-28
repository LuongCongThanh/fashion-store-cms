# Q. Cấu trúc từng module

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

### Q.1. Khung chuẩn một feature

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
├── views/                      # container, gắn route, chỉ Routes.ts import
│   ├── <Entity>CreateView.vue
│   ├── <Entity>DetailView.vue
│   ├── <Entity>EditView.vue
│   └── <Entity>ListView.vue
├── <Feature>.routes.ts            # mảng RouteRecordRaw của feature, Routes.ts gộp lại
├── Use<Feature>.ts                # chỉ khi feature khác cần dùng
└── Use<Feature>.spec.ts
```

`<Feature>.routes.ts` thêm vào whitelist §B.3 (chỉ `app/router/Routes.ts` được import), để route của feature nằm cùng feature và lazy-import `./views/...` bằng đường dẫn tương đối.

**Feature tối thiểu** = `api/` + `types/` + `views/` (+ `<Feature>.routes.ts`); mọi thư mục khác thêm khi cần. Tầng tuỳ chọn: `composables/` và `*.mapper.ts` chỉ tạo khi có lý do (quy tắc ≥ 2 nơi dùng áp dụng cả trong feature; mapper khi DTO lệch Model). Ban đầu view gọi thẳng composable của `api/`.

Thứ tự phụ thuộc bên trong feature (§T.1): `views → components` (props/emits) và `views → [composables] → api → [mapper] → types`; `components` chỉ import `types/`, `schemas/`, `@shared/components`; `stores/` (nếu có) chỉ `api/` và `Use<Feature>.ts` dùng.

### Q.2. Từng feature

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần trước](features-03.md)
