# 04 — Báo cáo

Trạng thái: done (đã merge)
Nhánh / PR: `chore/test-env-foundation` / #5
Ngày hoàn thành: 2026-11-07

## Đã làm

- Tạo `src/app/`, `src/app/config/Env.config.ts`, `src/layouts/DashboardLayout.vue`, `App.vue`, `main.ts`.
- `Env.config.ts` đọc và validate biến `VITE_*` bằng Zod; báo lỗi nêu tên biến thiếu và chỉ tới `.env.local`.
- Vitest theo §I: `vitest.config.ts`, `src/test/Setup.ts`, `src/test/Render.ts`, `src/test/factories/`.

## Kết quả kiểm tra

Kiểm tra lại ngày 2026-11-07 trên `dev` (sau khi merge).

| Mục kiểm tra (theo plan.md)                   | Kết quả | Ghi chú                                                                  |
| --------------------------------------------- | ------- | ------------------------------------------------------------------------ |
| App chạy thấy `DashboardLayout.vue`           | Pass    | `npm run build` thành công; layout được router dùng                      |
| `npm test` pass                               | Pass    | 15 file, 120 test pass                                                   |
| `Env.config.ts` báo lỗi rõ khi thiếu `VITE_*` | Pass    | `Env.config.spec.ts` 5/5 pass (nêu tên biến thiếu, trỏ tới `.env.local`) |

## Lệch so với plan / quyết định mới

- Không có.

## Việc còn tồn

- Report được điền bổ sung khi đóng giai đoạn scaffold (lúc merge PR #5 chưa ghi).
