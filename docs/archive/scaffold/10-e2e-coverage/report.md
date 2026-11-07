# 10 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `test/e2e-coverage` (stacked trên `feat/auth-skeleton`)
Ngày hoàn thành: 2026-11-07

## Đã làm

- `playwright.config.ts`: `testDir: e2e`, chỉ chạy Chromium. `webServer` dùng `vite` ở port 4174, nhận `VITE_API_BASE_URL` từ `.env.development`. Khi chạy trên CI: `forbidOnly`, `retries: 1`, reporter `github`.
- `e2e/Smoke.spec.ts` viết theo TDD: lần chạy đầu đỏ vì chưa có config. Có 2 ca:
  1. Chưa đăng nhập vào `/admin` thì về `/login?redirect=/admin` và thấy heading "Đăng nhập".
  2. Có sẵn Session (seed vào localStorage) thì `/` chuyển tới `/admin`, thấy StoreSwitcher ("Cửa hàng Quận 1") và UserMenu.
- Kiểm chứng test: tắt `router.beforeEach(authGuard)` thì ca 1 đỏ.
- Thêm script `test:e2e`. `test:coverage` (đã có từ plan 04) chạy được với v8.
- `tsconfig.node.json` typecheck thêm `playwright.config.ts` và `e2e/**` (thêm lib `DOM` cho code chạy trong `addInitScript`).

## Kết quả kiểm tra

| Mục kiểm tra            | Kết quả | Ghi chú                                                                                    |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `npm test`              | Pass    | 113/113                                                                                    |
| `npm run test:coverage` | Pass    | Tổng: statements 76.6%, branches 77.4%, functions 73.4%, lines 77.5%. Chưa đặt ngưỡng (§I) |
| `npm run test:e2e`      | Pass    | 2/2                                                                                        |

## Lệch so với plan / quyết định mới

- Smoke chưa đi qua bước "đăng nhập" như mô tả ở §A, vì form login và BE chưa có (P2). Ca 2 thay bằng seed Session. Khi có login thật, cần sửa ca này để đi qua form.
- Chưa thêm job e2e vào CI, đúng theo plan ("khi có flow thật"). Smoke hiện chạy không cần BE, nên có thể thêm sớm nếu muốn.

## Việc còn tồn

- Thêm job e2e vào CI (`npx playwright install --with-deps chromium` rồi chạy `npm run test:e2e`) khi có login thật.
- Token usage: chưa điền.
