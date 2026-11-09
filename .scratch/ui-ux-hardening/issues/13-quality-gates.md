# 13 — Phase 6: visual regression + a11y + performance budget

Status: done
Blocked by: 07, 09, 12

Playwright:

- Screenshot cho Login, Dashboard, Product list, Product edit, Category tree, Order detail, Design system, App shell mobile.
- Kích thước 375 / 768 / 1280; light + dark.
- Fixture ổn định (dùng fixture xấu nhất).
- **Không cần backend:** chặn mọi request API bằng `page.route()` và trả fixture; đăng nhập bằng Mock auth (DEV). Đây là test UI (layout thật, CSS, tương phản), không phải e2e với API thật.

Thêm `@axe-core/playwright` (đo lại tương phản thật, so với các tính toán trong audit). Performance budget theo baseline của #01.

Chế độ chỉ báo cáo trước. Check nào ổn định, có người phụ trách thì mới chặn merge.

Test: chính nó.

## Comments

- 2026-11-10: Thêm 42 browser cases cho 7 màn × 375/768/1280 × light/dark,
  cộng app shell mobile. Mỗi case dùng fixture xấu nhất, chặn horizontal overflow,
  lưu screenshot và axe report. Network được mock bằng `page.route()`; không cần backend.
- Performance gate report-only: largest JS chunk 530.05/560 kB, tổng CSS
  219.28/240 kB, đều PASS. Toàn bộ 43 Playwright tests pass trên Chromium.
