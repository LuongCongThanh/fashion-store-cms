# 13 — Phase 6: visual regression + a11y + performance budget

Status: ready-for-agent
Blocked by: 07, 09, 12

Playwright:

- Screenshot cho Login, Dashboard, Product list, Product edit, Category tree, Order detail, Design system, App shell mobile.
- Kích thước 375 / 768 / 1280; light + dark.
- Fixture ổn định (dùng fixture xấu nhất).
- **Không cần backend:** chặn mọi request API bằng `page.route()` và trả fixture; đăng nhập bằng Mock auth (DEV). Đây là test UI (layout thật, CSS, tương phản), không phải e2e với API thật.

Thêm `@axe-core/playwright` (đo lại tương phản thật, so với các tính toán trong audit). Performance budget theo baseline của #01.

Chế độ chỉ báo cáo trước. Check nào ổn định, có người phụ trách thì mới chặn merge.

Test: chính nó.
