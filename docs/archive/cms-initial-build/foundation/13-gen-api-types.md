# F13 — Script sinh API types

> Hồ sơ lịch sử nền tảng; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: done
Blocked by: 05
Nguồn: Step 6 · Spec tổng: [Phạm vi giai đoạn](../foundation.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../foundation.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Có script gen:api sinh type từ Swagger (hoặc placeholder).

### Phạm vi (Làm gì)

- Script `gen:api` dùng `openapi-typescript`, đọc `OPENAPI_URL` từ env (không có tiền tố `VITE_`, không expose ra browser).
- Nếu BE chưa có Swagger: `src/shared/types/Api.generated.ts` placeholder.

### Tiêu chí hoàn thành

`npm run gen:api` chạy được (hoặc báo rõ thiếu URL).

### Phụ thuộc

- Blocked by: 05

### Ngoài phạm vi

- Những việc của các plan con khác trong [spec tổng](../foundation.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

### Kế hoạch thực hiện

#### Step 6 — Script sinh API types

**Làm gì**

**Kiểm tra:** `npm run gen:api` chạy được (hoặc báo rõ thiếu URL).

### Phần tham chiếu

Các đoạn dùng chung được giữ một lần ở scaffold plan; đây là tài liệu lịch sử, không phải quy tắc hiện hành.

- [Scaffold — t3-dto-không-đi-ra-khỏi-api](../reference/data-flow.md#t3-dto-không-đi-ra-khỏi-api)

## Kết quả và review

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `chore/gen-api-types` (stacked trên `feat/navigation-devtools`)
Ngày hoàn thành: 2026-11-07

### Đã làm

- `scripts/GenApi.ts`, chạy bằng `tsx` theo §K.3:
  - Đọc `OPENAPI_URL` qua `loadEnv` của Vite, nên nhận được giá trị từ `.env`, `.env.local` hoặc biến môi trường. Biến không có tiền tố `VITE_`, nên không bị đưa ra browser.
  - Gọi `openapi-typescript` rồi ghi `src/shared/types/Api.generated.ts`, có header ghi rõ "sinh tự động, không sửa tay".
  - `OPENAPI_URL` nhận URL http(s), `file://`, hoặc đường dẫn tương đối.
  - Thiếu URL thì in hướng dẫn và thoát với mã 1. Generator lỗi thì in lỗi và thoát với mã 1.
- Script `gen:api` là `tsx scripts/GenApi.ts`.
- `tsconfig.node.json` typecheck thêm `scripts/**`.
- `Api.generated.ts` giữ bản placeholder (`paths` rỗng) từ plan 05, vì BE chưa có Swagger.

### Kết quả kiểm tra

| Mục kiểm tra                           | Kết quả | Ghi chú                                                                                                                                                                             |
| -------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run gen:api` báo rõ khi thiếu URL | Pass    | In "Thiếu OPENAPI_URL. Đặt trong .env.local…", mã thoát 1                                                                                                                           |
| `npm run gen:api` chạy được            | Pass    | Thử với một spec OpenAPI 3.0 mẫu (file tạm), sinh ra `paths` và `components`                                                                                                        |
| Kiểu `paths` thật áp vào HttpClient    | Pass    | Dùng file thử: `get('/products/{id}')` trả về kiểu `{ id; name }`. Sai path hoặc sai body đều báo lỗi (2 dòng `@ts-expect-error` có tác dụng). Đã khôi phục placeholder sau khi thử |
| lint, knip, test                       | Pass    |                                                                                                                                                                                     |

### Lệch so với plan / quyết định mới

- Script npm là `tsx scripts/GenApi.ts`, không phải `openapi-typescript $OPENAPI_URL -o …` như trong mẫu §G. Lý do: chạy qua script thì đọc được `.env.local` và báo lỗi rõ khi thiếu URL; mẫu §G không đọc được file `.env`.
- Header ban đầu có chuỗi `features/*/api`, trong đó `*/` đóng comment sớm làm file sinh ra lỗi cú pháp. Lần chạy thử đã phát hiện; đã đổi thành `features/<feature>/api/`.

### Việc còn tồn

- Khi có Swagger thật, các URL tự đặt sẽ báo lỗi typecheck, vì HttpClient khi đó chỉ nhận path có trong `paths`. Danh sách cần sửa: `/ping`, `/me`, `/orders`, `/products` trong các spec, và `/auth/refresh` trong `Runtime.ts`. Lúc đó cần đổi test sang path thật, hoặc tạo một `paths` riêng cho test. Đây là hành vi mong muốn (§M.1).
- Token usage: chưa điền.
