# Luồng dữ liệu và trách nhiệm code

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## Các tầng trong một feature

```text
            ┌──────────────────────────── feature ─────────────────────────────┐
 Route ──►  views/            container: lấy data, điều phối, KHÔNG markup phức tạp
              │  props ▼  ▲ emits
            components/       presentational: chỉ props in / emits out, KHÔNG gọi API
              │
            [composables/]    logic màn hình: form, filter, quyền — tuỳ chọn
              │
            api/<Feature>.api.ts   server state: Vue Query composable, query key, invalidate
              │
            [api/<Entity>.mapper.ts] DTO ⇄ Model — chỉ khi lệch
            └──┼──────────────────────────────────────────────────────────────┘
               ▼
            shared/lib/api/client/HttpClient  ──►  BE
```

| Tầng                           | Được làm                                                                                                                                   | Không được làm                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `views/` (container)           | Gọi composable của `api/` và `composables/`; truyền **model** xuống component qua props; xử lý emits; [Loading/Empty/Error](../conventions/api-errors.md) | Gọi `useHttpClient()`; map DTO; chứa logic validate                     |
| `components/` (presentational) | Render theo props, emit sự kiện, state UI cục bộ (mở/đóng, hover)                                                                          | Import `../api/`, `../stores/`, `../composables/`; gọi router; biết DTO |
| `composables/` (feature)       | Ghép schema + mutation + `applyApiErrorToForm`; tính toán dẫn xuất                                                                         | Render; giữ bản sao dữ liệu server                                      |
| `api/<Feature>.api.ts`         | Hàm HTTP (nội bộ), query key, `useXxxQuery` / `useXxxMutation`, invalidate; **trả về Model**                                               | Toast thành công, điều hướng, UI                                        |
| `api/<Entity>.mapper.ts`       | `toModel(dto)`, `toPayload(input)` — thuần, có test                                                                                        | Gọi HTTP, phụ thuộc Vue                                                 |
| `types/`                       | **Model** của FE (tên field theo FE, `Date` thay chuỗi ISO, tiền là `number`…)                                                             | Re-export DTO                                                           |
| `schemas/`                     | Zod cho **input** form và list params                                                                                                      | Kiểu server trả về                                                      |

## Ba loại dữ liệu, ba chỗ ở

| Loại                    | Ở đâu                                 | Ví dụ                                          | Quy tắc                                                                        |
| ----------------------- | ------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| Server state            | Vue Query cache (qua `api/`)          | danh sách sản phẩm, đơn hàng                   | **Không** copy vào Pinia/`ref`; đọc qua query, đổi qua mutation + invalidate   |
| Client state dùng chung | Pinia trong `stores/` của feature     | thông tin tài khoản/quyền                      | Chỉ `api/` và `Use<Feature>.ts` đọc/ghi                                        |
| UI / form state         | `ref` trong component hoặc composable | bản nháp form, dialog mở, filter (đồng bộ URL) | Form làm việc trên **bản nháp** (`XxxInput` từ schema), submit mới `toPayload` |

## DTO không đi ra khỏi `api/`

> Source đã chuyển theo cấu trúc mới dùng quy tắc của ADR 0001 (bảng thay thế), không dùng mục này.

- Kiểu `components['schemas'][...]` từ `Api.generated.ts` **chỉ** được import trong `features/*/api/**` và `shared/lib/api/**` (ESLint [§E](../conventions/module-boundaries.md), `noDto`).
- Khi DTO trùng Model: **không tạo mapper**. `types/` vẫn khai báo Model độc lập (không alias DTO); `api/` trả DTO với kiểu Model — TypeScript so khớp cấu trúc nên BE đổi field là typecheck báo lỗi ngay trong `api/`.
- Khi lệch (đổi tên, `Date`, tiền chuỗi → `number`…): tạo `<Entity>.mapper.ts` + test; BE đổi tiếp chỉ sửa mapper, view/component không đổi.

## Đọc implementation thực tế

Không dùng lại DTO hoặc endpoint giả của scaffold. Các ví dụ đã có owner trong source:

- [Products.api.ts](../../src/features/products/api/Products.api.ts): request, query key và list composable.
- [Product mapper](../../src/features/products/api/Product.mapper.ts): chuyển dữ liệu theo API Contract đã pin.
- [ProductListView.vue](../../src/features/products/views/ProductListView.vue): container nối query, list state và component.
- [HttpClient.ts](../../src/shared/lib/api/client/HttpClient.ts): transport được runtime inject, không singleton.

Khi viết mới, lấy operation/type thực tế từ Generated API và dùng alias theo [import boundary](../conventions/module-boundaries.md); không sao chép import `../` trái rule của repo. Form làm việc trên draft, không sửa trực tiếp query result.

## Áp dụng SOLID

Áp dụng ở mức **module** (file, composable, adapter), không ép thành class/interface cho mọi thứ. Một seam chỉ tạo khi có ≥ 2 adapter thật (VD: HttpClient thật + adapter test).

| Nguyên lý                     | Áp dụng trong CMS                                                                                                                                                                                                                                                                                                     | Ở đâu                                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **S** — Single Responsibility | Mỗi tầng một lý do để đổi: hiển thị (component), điều phối (view), logic màn hình (composable), server state (api), hình dạng dữ liệu (mapper), vận chuyển HTTP (HttpClient). Tầng tuỳ chọn (composable, mapper) chỉ tạo khi có trách nhiệm thật                                                                      | [§T.1](#các-tầng-trong-một-feature), [§O.3](../conventions/api-errors.md)                                                     |
| **O** — Open/Closed           | Mở rộng bằng **khai báo**, không sửa lõi: thêm route → tự vào sidebar/command palette/phím tắt qua `meta`; thêm mã lỗi → thêm key `errors.*`; thêm cột bảng → mảng `columns` truyền vào `DataTable`; thêm trạng thái → thêm dòng trong map màu                                                                        | [§S.1](app-capabilities.md), [§O.2](../conventions/api-errors.md), [§L.4](../conventions/ui-components.md), [DataTable](app-capabilities.md) |
| **L** — Liskov Substitution   | Mọi adapter tại một seam phải giữ đúng hợp đồng của interface: `HttpClient` test (adapter mock) vẫn ném `ApiError`, vẫn trả `data`; Session dựng với `initial` trong test vẫn phát `authFailure` khi refresh thất bại. Component bọc Nuxt UI (VD `DataTable`) nhận/emit đúng như component gốc, không đổi nghĩa props | [§M](http-session.md), [§I](../testing/runtime.md)                                                                        |
| **I** — Interface Segregation | Interface nhỏ theo nhu cầu caller: HttpClient chỉ thấy `Session` (token, refresh) — không thấy `login`, `user`; props component chỉ nhận Model cần hiển thị, không nhận cả object query                                                                                                                               | [§M](http-session.md), [§Q.3](../conventions/module-boundaries.md)                                                            |
| **D** — Dependency Inversion  | Tầng thấp không biết tầng cao: `HttpClient` phụ thuộc hàm (`getAccessToken`, `getLocale`…), không import feature; feature phụ thuộc interface `HttpClient`, không phụ thuộc axios; mọi thứ được nối ở **một** nơi — `createAppRuntime()` trong `app/Runtime.ts` (composition root, D37)                               | [§A](../conventions/project-structure.md) (chiều phụ thuộc), [§M.2](http-session.md)                                          |

**Không làm (tránh over-engineering):**

- Không tạo `IProductRepository` + class `ProductRepository` — `Products.api.ts` đã là seam; test đi qua HTTP ([§I](../testing/runtime.md)).
- Không DI container (inversify…) — `provide/inject` của Vue + composition root là đủ.
- Không base class cho component/store; tái sử dụng bằng composable và composition.
- Không tách interface khi chỉ có một adapter và không có test cần thay thế.
- Không tạo module chuyển tiếp: mapper identity, composable chỉ gọi lại mutation, file interceptor 3 dòng.

**Kiểm soát:** ESLint ([§E](../conventions/module-boundaries.md)) chặn `components/` import `api/`/`stores/`/`composables/` và chặn DTO ngoài `api/`; checklist PR thêm mục "Không có DTO ngoài `api/`, component không gọi API".

---

Tra cứu: [Mục lục chủ đề](../conventions/README.md) · [Toàn bộ tài liệu](../README.md).
