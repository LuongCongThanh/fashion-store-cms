# B. Quy tắc đặt tên

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

### B.1. File và thư mục

| Loại                              | Quy tắc                                                                                                                                                 | Ví dụ                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Thư mục                           | Một từ: viết thường · nhiều từ: PascalCase · không kebab-case; feature số nhiều (trừ danh từ không đếm được: `auth`, `dashboard`, `inventory`, `media`) | `features/products/`, `features/AuditLogs/`, `test/factories/`                                   |
| Thư mục chức năng trong feature   | cố định, số nhiều: `api/`, `components/`, `composables/`, `schemas/`, `stores/`, `types/`, `views/` (riêng `api/` giữ nguyên)                           |                                                                                                  |
| Component                         | PascalCase, ≥ 2 từ                                                                                                                                      | `ProductTable.vue`, `ProductStatusBadge.vue`                                                     |
| View (gắn route)                  | PascalCase + hậu tố `View`                                                                                                                              | `ProductListView.vue`                                                                            |
| Layout                            | PascalCase + hậu tố `Layout`                                                                                                                            | `DashboardLayout.vue`                                                                            |
| Composable                        | `Use` + PascalCase                                                                                                                                      | `UseAuth.ts`, `UseListState.ts`                                                                  |
| Store                             | PascalCase + `.store.ts`                                                                                                                                | `Auth.store.ts`                                                                                  |
| API                               | PascalCase + `.api.ts`                                                                                                                                  | `Products.api.ts`                                                                                |
| Schema (Zod)                      | PascalCase + `.schema.ts`                                                                                                                               | `Product.schema.ts`                                                                              |
| Types                             | PascalCase + `.types.ts`                                                                                                                                | `Product.types.ts`                                                                               |
| Config                            | PascalCase + `.config.ts`                                                                                                                               | `Env.config.ts`                                                                                  |
| Module thường                     | PascalCase                                                                                                                                              | `HttpClient.ts`, `ApiError.ts`                                                                   |
| Test                              | tên file nguồn + `.spec.ts`                                                                                                                             | `Guards.spec.ts`, `ProductTable.spec.ts`                                                         |
| Route của feature                 | `<Feature>` + `.routes.ts`                                                                                                                              | `Products.routes.ts`                                                                             |
| Mapper                            | `<Entity>` + `.mapper.ts`, trong `api/`, chỉ khi DTO lệch Model (§T.3)                                                                                  | `Product.mapper.ts`                                                                              |
| Test factory                      | `<Entity>` + `.factory.ts`                                                                                                                              | `User.factory.ts`                                                                                |
| Khai báo kiểu                     | PascalCase + `.d.ts`                                                                                                                                    | `Router.d.ts`, `VueQuery.d.ts`                                                                   |
| File sinh tự động                 | PascalCase + `.generated.ts`                                                                                                                            | `Api.generated.ts`                                                                               |
| Asset tĩnh (`assets/`, `public/`) | PascalCase (trừ `favicon.svg`, `robots.txt` do trình duyệt/bot yêu cầu)                                                                                 | `Logo.svg`, `EmptyBox.svg`                                                                       |
| Ngoài `src/` (`e2e/`, `scripts/`) | PascalCase                                                                                                                                              | `Smoke.spec.ts`, `GenApi.ts`                                                                     |
| File do tool quy định             | Giữ nguyên tên tool yêu cầu                                                                                                                             | `package.json`, `vite.config.ts`, `.github/ISSUE_TEMPLATE/bug_report.md`, `pwa-assets.config.ts` |

Hậu tố hợp lệ (cấu hình cho `check-file`): `.api`, `.mapper`, `.routes`, `.store`, `.schema`, `.types`, `.config`, `.factory`, `.generated`, `.spec`, `.d`.

Ngoại lệ (giữ tên do tool quy định): `main.ts`, `main.css`, `env.d.ts`, `locales/*.json`, mọi file config ở thư mục gốc (`vite.config.ts`, `eslint.config.ts`…), `scripts/`.

Lưu ý: tên file `UseAuth.ts` khác hoa/thường với hàm `useAuth` là có chủ đích (D14). Khi đổi tên chỉ khác hoa/thường (VD file Vite sinh sẵn) phải dùng `git mv` — macOS/Windows không phân biệt hoa/thường nên git không nhận đổi tên.

### B.2. Trong code

| Loại                     | Quy tắc                                                                                                   | Ví dụ                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Biến, hàm                | camelCase                                                                                                 | `fetchProducts`, `isLoading`                    |
| Boolean                  | tiền tố `is/has/can/should`                                                                               | `canEdit`                                       |
| Hằng số module           | UPPER_SNAKE_CASE                                                                                          | `DEFAULT_PAGE_SIZE`                             |
| Type / interface         | PascalCase, không tiền tố `I`                                                                             | `Product`, `ProductListQuery`                   |
| Enum-like                | `as const` object + union type, không dùng `enum`                                                         | `OrderStatus`                                   |
| Composable export        | `useXxx`                                                                                                  | `export function useAuth()`                     |
| Pinia store              | `useXxxStore`, id = tên feature                                                                           | `defineStore('auth', …)`                        |
| Zod schema               | `xxxSchema`, type suy ra `XxxInput`                                                                       | `productSchema`                                 |
| Component trong template | PascalCase                                                                                                | `<ProductTable />`                              |
| Props / emits            | camelCase cả script và template (`vue/attribute-hyphenation: never`, `vue/v-on-event-hyphenation: never`) | `:modelValue`, `@update:modelValue`             |
| Route name               | `feature.action`                                                                                          | `products.list`, `products.edit`                |
| Route path               | chữ thường, nhiều từ nối `-` (URL, không phải tên file — giữ chuẩn web), số nhiều                         | `/admin/products/:id/edit`, `/admin/audit-logs` |
| i18n key                 | `feature.scope.key`, camelCase từng đoạn                                                                  | `products.form.titleCreate`                     |
| Query key                | mảng bắt đầu bằng tên feature                                                                             | `['products', 'list', params]`                  |
| Env                      | `VITE_` + UPPER_SNAKE                                                                                     | `VITE_API_BASE_URL`                             |

### B.3. Ranh giới feature

- **Whitelist**: code ngoài feature chỉ được import `@features/<x>/Use*` và `@features/<x>/types/*`; mọi đường dẫn khác vào `@features/**` bị chặn (bao gồm `api/`, `stores/`, `schemas/`, `components/`, `views/` và thư mục thêm sau).
- Trong cùng một feature: import nội bộ bằng đường dẫn tương đối `./` / `../` (không vượt ra ngoài thư mục feature); không dùng `@features/<chính-nó>/...`.
- `views/` chỉ được import từ `app/router/Routes.ts` (lazy `() => import(...)`).
- `types/` chỉ chứa type/const thuần dữ liệu. Map hành vi (VD `OrderStatus → color`) đặt trong `components/` của feature (§L.4), không đặt trong `types/` vì `types/` là interface công khai.
- Không dùng `index.ts` barrel.

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
