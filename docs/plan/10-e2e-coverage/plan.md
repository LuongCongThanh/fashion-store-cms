# 10 — E2E và coverage

Status: ready-for-agent
Blocked by: 09
Nguồn: Step 5 trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 5 — E2E và coverage

**Làm gì**

- Playwright + `e2e/Smoke.spec.ts`.
- Bật `test:coverage`; thêm job e2e vào CI khi có flow thật.

**Kiểm tra:** `npm test`, `npm run test:coverage` và `npm run test:e2e` đều pass.

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

_Không có phần tham chiếu riêng; dùng phần dùng chung._
