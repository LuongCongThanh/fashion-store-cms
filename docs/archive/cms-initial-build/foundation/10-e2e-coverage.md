# F10 — E2E và coverage

> Hồ sơ lịch sử nền tảng; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: done
Blocked by: 09
Nguồn: Step 5 · Spec tổng: [Phạm vi giai đoạn](../foundation.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../foundation.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Có Playwright smoke test và báo cáo coverage.

### Phạm vi (Làm gì)

- Playwright + `e2e/Smoke.spec.ts`.
- Bật `test:coverage`; thêm job e2e vào CI khi có flow thật.

### Tiêu chí hoàn thành

`npm test`, `npm run test:coverage` và `npm run test:e2e` đều pass.

### Phụ thuộc

- Blocked by: 09

### Ngoài phạm vi

- Những việc của các plan con khác trong [spec tổng](../foundation.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

### Kế hoạch thực hiện

#### Step 5 — E2E và coverage

**Làm gì**

**Kiểm tra:** `npm test`, `npm run test:coverage` và `npm run test:e2e` đều pass.

### Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

_Không có phần tham chiếu riêng; dùng phần dùng chung._

## Kết quả và review

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `test/e2e-coverage` (stacked trên `feat/auth-skeleton`)
Ngày hoàn thành: 2026-11-07

### Đã làm

- `playwright.config.ts`: `testDir: e2e`, chỉ chạy Chromium. `webServer` dùng `vite` ở port 4174, nhận `VITE_API_BASE_URL` từ `.env.development`. Khi chạy trên CI: `forbidOnly`, `retries: 1`, reporter `github`.
- `e2e/Smoke.spec.ts` viết theo TDD: lần chạy đầu đỏ vì chưa có config. Có 2 ca:
  1. Chưa đăng nhập vào `/admin` thì về `/login?redirect=/admin` và thấy heading "Đăng nhập".
  2. Có sẵn Session (seed vào localStorage) thì `/` chuyển tới `/admin`, thấy StoreSwitcher ("Cửa hàng Quận 1") và UserMenu.
- Kiểm chứng test: tắt `router.beforeEach(authGuard)` thì ca 1 đỏ.
- Thêm script `test:e2e`. `test:coverage` (đã có từ plan 04) chạy được với v8.
- `tsconfig.node.json` typecheck thêm `playwright.config.ts` và `e2e/**` (thêm lib `DOM` cho code chạy trong `addInitScript`).

### Kết quả kiểm tra

| Mục kiểm tra            | Kết quả | Ghi chú                                                                                    |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `npm test`              | Pass    | 113/113                                                                                    |
| `npm run test:coverage` | Pass    | Tổng: statements 76.6%, branches 77.4%, functions 73.4%, lines 77.5%. Chưa đặt ngưỡng (§I) |
| `npm run test:e2e`      | Pass    | 2/2                                                                                        |

### Lệch so với plan / quyết định mới

- Smoke chưa đi qua bước "đăng nhập" như mô tả ở §A, vì form login và BE chưa có (P2). Ca 2 thay bằng seed Session. Khi có login thật, cần sửa ca này để đi qua form.
- Chưa thêm job e2e vào CI, đúng theo plan ("khi có flow thật"). Smoke hiện chạy không cần BE, nên có thể thêm sớm nếu muốn.

### Việc còn tồn

- Thêm job e2e vào CI (`npx playwright install --with-deps chromium` rồi chạy `npm run test:e2e`) khi có login thật.
- Token usage: chưa điền.
