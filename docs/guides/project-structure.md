# Cấu trúc source và import alias

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## Cây thư mục đầy đủ

Source thực tế là nguồn chuẩn cho inventory; không duy trì bản sao cây file đầy đủ theo Phase scaffold. Các owner hiện tại:

| Vị trí                                           | Trách nhiệm                                     |
| ------------------------------------------------ | ----------------------------------------------- |
| [`src/app`](../../src/app)                       | Runtime, providers, cấu hình và router          |
| [`src/features`](../../src/features)             | Nghiệp vụ, API/query/mapper, routes và màn hình |
| [`src/layouts`](../../src/layouts)               | Shell và navigation suy từ route meta           |
| [`src/shared`](../../src/shared)                 | UI và kỹ thuật dùng chung, không biết nghiệp vụ |
| [`src/locales`](../../src/locales)               | Bản dịch giao diện                              |
| [`src/assets`](../../src/assets)                 | Font/ảnh/CSS theo DESIGN                        |
| [`src/test`](../../src/test), [`e2e`](../../e2e) | Test helpers và hành trình toàn ứng dụng        |

Cây đích được duyệt nhưng chưa triển khai nằm ở [migration](../plans/structure-migration/README.md). Cây Phase ban đầu được giữ trong [scaffold plan](../archive/cms-initial-build/README.md), chỉ dùng tra lịch sử.

- `@app/*` chỉ được import từ `main.ts` (và `vite.config.ts` cho `Ui.config.ts`, test của chính `app/`, và `src/test/` để gọi `createAppRuntime()` — D37). Thứ UI cần dùng (locale, theme, PWA) nằm ở `shared/`, không ở `app/`.
- `layouts/` không import `app/`; `features/` không import `app/`, `layouts/`.
- `shared/` không import `app/`, `layouts/`, `features/` — điều kiện để tái sử dụng được (ESLint, [§E](module-boundaries.md)).
- Code đưa vào `shared/` khi có **≥ 2 nơi** dùng thật; trước đó để trong feature. Không đưa code nghiệp vụ (biết `Product`, `Order`, endpoint riêng…) vào `shared/` — VD upload ảnh nằm trong `features/products/` vì products là consumer nghiệp vụ hiện tại duy nhất.
- Trạng thái nghiệp vụ dùng chung giữa các feature là **một feature** có interface riêng, không phải store của `app/`.
- Trong `shared/`: `lib/` không import `components/`, `composables/`; `components/` không gọi API. Một component kèm composable mở nó (VD `confirm/`) đặt chung một thư mục.
- `shared/utils/`: mỗi file một chủ đề (`Money.ts`, `Slug.ts`), không có `Helpers.ts` gom linh tinh.
- `shared/types/Common.types.ts`, `Pagination.types.ts` chỉ tạo khi có type dùng chung thật, không tạo file chỉ re-export `Api.generated.ts`.
- `locales/` giữ một file mỗi ngôn ngữ; khi > ~500 dòng mới tách theo feature ([§H](localization.md)).

Mục này là bản cho người đọc; bảng `BOUNDARIES` ([§E](module-boundaries.md)) là bản được ESLint kiểm. Mỗi quy tắc import ở đây phải có dòng tương ứng trong `BOUNDARIES` và ít nhất một ca trong `eslint.config.spec.ts` — sửa một bên thì sửa cả bên kia.

---

## Import alias

> Source đã chuyển theo cấu trúc mới dùng quy tắc của ADR 0001 (bảng thay thế), không dùng mục này.

Mỗi thư mục cấp 1 trong `src/` có một alias (7 alias: `@app`, `@assets`, `@features`, `@layouts`, `@locales`, `@shared`, `@test`). Quy tắc import tương đối (ESLint, [§E](module-boundaries.md)):

- **Ngoài `features/`**: chỉ được `./` (cùng thư mục). Mọi `../` đều bị chặn, kể cả trong cùng thư mục cấp 1 (`layouts/components/AppHeader.vue` → `../AuthLayout.vue` phải viết `@layouts/AuthLayout.vue`).
- **Trong một feature**: được `./` và `../` (một cấp, giữa `api/`, `components/`…); `../../` bị chặn.
- Còn lại luôn dùng alias.

| Alias         | Trỏ tới          | Ví dụ                                                                                                            |
| ------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| `@app/*`      | `src/app/*`      | `@app/router/Router` (chỉ `main.ts`)                                                                             |
| `@assets/*`   | `src/assets/*`   | `@assets/images/Logo.svg`                                                                                        |
| `@features/*` | `src/features/*` | `@features/auth/UseAuth`                                                                                         |
| `@layouts/*`  | `src/layouts/*`  | `@layouts/DashboardLayout.vue`                                                                                   |
| `@shared/*`   | `src/shared/*`   | `@shared/components/feedback/ErrorState.vue`, `@shared/lib/api/errors/ApiError`, `@shared/lib/api/Api.generated` |
| `@locales/*`  | `src/locales/*`  | `@locales/vi.json`                                                                                               |
| `@test/*`     | `src/test/*`     | `@test/Render` (chỉ trong `*.spec.ts` và `src/test/`)                                                            |

- Không có alias gốc `@/` — mỗi import cho thấy ngay nó thuộc tầng nào, ESLint kiểm tra chiều phụ thuộc ([§A](#cây-thư-mục-đầy-đủ)) dễ hơn.
- **Nguồn duy nhất là `tsconfig.app.json`** (`paths` dạng `./src/...`, không cần `baseUrl`); Vite/Vitest đọc lại qua `vite-tsconfig-paths` với `loose: true` (thiếu `loose` thì import alias từ file `.vue` không resolve), không khai báo lặp `resolve.alias`.

> Nguồn: [`tsconfig.app.json`](../../tsconfig.app.json) — tài liệu không chép lại code, đọc file.

> Nguồn: [`vite.config.ts`](../../vite.config.ts) — tài liệu không chép lại code, đọc file.

Thứ tự nhóm import (`perfectionist/sort-imports`): built-in → package ngoài → alias nội bộ (`@app`, `@features`… theo bảng) → tương đối `./ ../` → `import type` cuối mỗi nhóm. Cấu hình `internalPattern: ['^@(app|assets|features|layouts|locales|shared|test)/']`.

---

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../README.md).
