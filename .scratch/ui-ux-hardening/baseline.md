# UI/UX hardening baseline

Đo ngày 2026-11-10 trên commit `bcdb3fa` bằng `npm run analyze`. Số dưới đây là
chunk route đã minify / gzip; shared dependencies được tách chunk nên không cộng
vào từng route.

| Route / màn hình | Chunk kB | Gzip kB |
| --- | ---: | ---: |
| Dashboard | 7.28 | 2.94 |
| Product list | 11.79 | 4.50 |
| Product detail | 2.21 | 1.07 |
| Product create/edit | 1.39 | 0.66 |
| Category list | 3.09 | 1.45 |
| Order list | 4.76 | 1.94 |
| Order detail | 5.05 | 1.93 |
| Customer list | 2.91 | 1.32 |
| Customer detail | 4.20 | 1.76 |
| Inventory list | 4.88 | 2.09 |
| Stock movements | 2.25 | 1.06 |
| Promotion list | 3.32 | 1.41 |
| User list | 3.62 | 1.54 |
| Role list | 2.09 | 1.05 |
| Store settings | 4.01 | 1.80 |
| Localization settings | 4.05 | 1.75 |
| Login | 3.25 | 1.46 |
| App shell (`DashboardLayout`) | 107.23 | 24.62 |

Các mốc bundle cần theo dõi ở quality gate: CSS chung 219.02 kB (30.26 gzip),
entry 359.50 kB (118.48 gzip), editor tải động 386.88 kB (122.42 gzip), và
chunk thư viện lớn nhất 530.05 kB (180.38 gzip). Build hiện cảnh báo chunk lớn
hơn 500 kB.

## Đối chiếu inventory

Danh mục trong `docs/plans/cms-pages-components/fashion-store-cms-pages-components.md`
được đối chiếu với code hiện tại:

- **implemented:** toàn bộ route nghiệp vụ đã liệt kê; app shell, breadcrumb,
  locale/theme, PageContainer; shared list/table/form/feedback; dashboard;
  products, categories, orders, customers, inventory, promotions, users/roles,
  settings và media.
- **partial:** Dashboard widgets chưa đủ loading/empty/error; các list ngoài
  Product chưa theo reference mới; Product form, Order detail, Category tree và
  Permission matrix chưa đạt archetype/accessibility mới; command palette chưa có.
- **missing:** quality gate Playwright screenshot/axe/budget của hardening plan.
- **backlog:** AppNotifications, content/blog, media library, payment/shipping/email
  settings, audit log và bulk import/export; giữ nguyên ngoài phạm vi.

Visual rule không được lặp ở inventory; nguồn chuẩn là `DESIGN.md`.

## Gap tại baseline

### Design-system gap

- Form feature cũ vẫn còn native input/select; file upload là ngoại lệ hợp lệ,
  còn category, promotion, role, settings, user và product editor cần rollout
  Nuxt UI trong các archetype tương ứng.
- Một số prototype DEV giữ `rounded-xl`, palette thô và formatter cục bộ. Chúng
  không nằm trên route production nhưng quality gate phải loại khỏi ảnh chuẩn
  hoặc dọn khi prototype được gỡ.
- `OrderItems`, product detail/variant và permission matrix vẫn dùng table markup
  riêng; chỉ hợp lệ khi giữ đủ semantics, overflow và keyboard behavior.

### Shared-pattern gap

- List reference mới chỉ áp cho Product list; toolbar, active chips, responsive
  column priority và shared states chưa rollout cho các list còn lại.
- Form chưa có section navigation và validation-summary focus; Detail chưa có
  progress pattern dùng chung.
- PageTabs và ActiveFilterTags còn native button tự viết; cần giữ focus-visible
  và accessible name nếu không có Nuxt UI primitive phù hợp.

### Feature gap

- Order detail, Product editor, Category tree, Permission matrix và Dashboard là
  các reference/interaction ticket 09–12.
- Dashboard cần endpoint hàng đợi; trước khi backend có, chỉ được tổng hợp qua
  list API đã tồn tại và ghi rõ đây là adapter tạm.
- Chưa có command palette và chưa có browser-level visual/a11y/performance gate.

