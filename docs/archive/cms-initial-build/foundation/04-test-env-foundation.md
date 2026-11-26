# F04 — Env và nền tảng test

> Hồ sơ lịch sử nền tảng; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: done
Blocked by: 02
Nguồn: Step 3a (phần 1) · Spec tổng: [Phạm vi giai đoạn](../foundation.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../foundation.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Có Env validate bằng Zod và Vitest sẵn sàng để các plan sau viết test ngay.

### Phạm vi (Làm gì)

- Tạo `app/`, `config/Env.config.ts`, `layouts/`, `App.vue`, `main.ts` với nội dung tối thiểu.
- `Env.config.ts`: đọc và validate `VITE_*` bằng Zod.
- Vitest theo §I: `vitest.config.ts`, `src/test/Setup.ts`, `src/test/Render.ts` (cài sớm để các step sau viết test ngay).

### Tiêu chí hoàn thành

app chạy thấy `DashboardLayout.vue` rỗng; `npm test` pass; `Env.config.ts` báo lỗi rõ khi thiếu biến `VITE_*` bắt buộc.

### Phụ thuộc

- Blocked by: 02

### Ngoài phạm vi

- Những việc của các plan con khác trong [spec tổng](../foundation.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

### Kế hoạch thực hiện

#### Step 3a (phần 1) — Env và nền tảng test

**Làm gì**

**Kiểm tra:** app chạy thấy `DashboardLayout.vue` rỗng; `npm test` pass; `Env.config.ts` báo lỗi rõ khi thiếu biến `VITE_*` bắt buộc.

### Phần tham chiếu

Các đoạn dùng chung được giữ một lần ở scaffold plan; đây là tài liệu lịch sử, không phải quy tắc hiện hành.

- [Scaffold — i-cấu-hình-unit--component-test-vitest](../reference/testing.md#i-cấu-hình-unit--component-test-vitest)

## Kết quả và review

Trạng thái: done (đã merge)
Nhánh / PR: `chore/test-env-foundation` / #5
Ngày hoàn thành: 2026-11-07

### Đã làm

- Tạo `src/app/`, `src/app/config/Env.config.ts`, `src/layouts/DashboardLayout.vue`, `App.vue`, `main.ts`.
- `Env.config.ts` đọc và validate biến `VITE_*` bằng Zod; báo lỗi nêu tên biến thiếu và chỉ tới `.env.local`.
- Vitest theo §I: `vitest.config.ts`, `src/test/Setup.ts`, `src/test/Render.ts`, `src/test/factories/`.

### Kết quả kiểm tra

Kiểm tra lại ngày 2026-11-07 trên `dev` (sau khi merge).

| Mục kiểm tra (theo plan.md)                   | Kết quả | Ghi chú                                                                  |
| --------------------------------------------- | ------- | ------------------------------------------------------------------------ |
| App chạy thấy `DashboardLayout.vue`           | Pass    | `npm run build` thành công; layout được router dùng                      |
| `npm test` pass                               | Pass    | 15 file, 120 test pass                                                   |
| `Env.config.ts` báo lỗi rõ khi thiếu `VITE_*` | Pass    | `Env.config.spec.ts` 5/5 pass (nêu tên biến thiếu, trỏ tới `.env.local`) |

### Lệch so với plan / quyết định mới

- Không có.

### Việc còn tồn

- Report được điền bổ sung khi đóng giai đoạn scaffold (lúc merge PR #5 chưa ghi).
