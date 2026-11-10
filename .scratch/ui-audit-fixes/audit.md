# Audit UI — `/impeccable audit` ngày 2026-11-10

Nhánh lúc audit: `feat/form-controls` (commit `1b52982`). Đối chiếu với `DESIGN.md`.

## Phạm vi và giới hạn

- Phương pháp: đọc code, chạy detector của impeccable (`impeccable detect src`, không có finding nào) và tìm theo mẫu vi phạm contract. Các thư mục `prototype/` không được tính.
- **Chưa render trên trình duyệt.** Tỉ lệ tương phản được tính từ bước palette (amber-500 trên nền trắng ≈ 2.1:1). Lỗi tràn ở 375px được suy ra từ class. Cần xác nhận ở 375px và 1280px, cả light lẫn dark, trước khi chốt.
- Hover/focus/loading/error được kiểm qua tìm kiếm và một số file đại diện, chưa duyệt hết từng component.
- Mode của bề mặt: **Operate** (app admin). Ưu tiên khả năng quét, tính nhất quán và mật độ thông tin; chất editorial chỉ dùng ở login, empty state, page header và dashboard (theo `DESIGN.md`).

## Điểm sức khoẻ

| # | Hạng mục | Điểm | Vấn đề chính |
|---|---|---|---|
| 1 | Khả năng truy cập | 3 | Banner offline: chữ trắng trên nền amber ≈ 2.1:1 |
| 2 | Hiệu năng | 3 | Ảnh ở gallery và trang chi tiết không lazy-load |
| 3 | Theme / token | 3 | Không có màu hardcode; có 2 chỗ dùng sai màu trạng thái |
| 4 | Responsive | 2 | Ảnh và bảng ở chi tiết Product, cùng gallery, tràn ở 375px |
| 5 | Bám design system | 2 | Dashboard và các màn list chưa theo bố cục đã duyệt |
| | **Tổng** | **13/20** | **Chấp nhận được (cần sửa đáng kể)** |

## Kết luận về mức bám design system

**Đạt một phần.** Phần nền đã chắc: token ngữ nghĩa, `DataTable` dùng chung, sidebar/nav, focus ring, `motion-reduce`. Lỗi nằm ở các màn **chưa được làm lại** theo `DESIGN.md`: dashboard, chi tiết Product, gallery ảnh, và 8 màn list chưa có toolbar.

## Phát hiện theo mức độ

### P1 — sửa trước khi release

**1. Banner offline không đủ tương phản**
- Vị trí: `src/shared/components/feedback/OfflineBanner.vue:16-17`
- Hạng mục: Khả năng truy cập / Theme
- Hiện trạng: `color="warning" variant="solid"`, tức chữ trắng trên amber-500 ≈ 2.1:1. `DESIGN.md` cấm dùng `solid` cho warning/info/success.
- Ảnh hưởng: khó đọc đúng lúc người dùng cần biết đã mất mạng.
- Chuẩn: WCAG 1.4.3 (4.5:1).
- Đề xuất: `variant="subtle"`.
- Ticket: `issues/01`

**2. Gallery ảnh không có thứ bậc thị giác**
- Vị trí: `src/features/media/components/ImageGallery.vue:19-36`
- Hạng mục: Bám design system / Responsive / Hiệu năng
- Hiện trạng:
  - Mỗi ảnh có 4 `UButton` solid primary, nên 6 ảnh tạo ra 24 nút nặng như nhau, vi phạm quy tắc "tối đa 1 nút chính mỗi vùng".
  - Nút xoá là `color="error"` solid và không qua `useConfirm`.
  - Ảnh `h-28 w-28`: không bo góc, không theo tỉ lệ 3:4, không `loading="lazy"`.
  - Nút xếp chồng dưới ảnh 112px trông như layout vỡ.
- Đề xuất: mỗi ảnh một menu `⋯`, xoá qua `useConfirm`, badge "Ảnh chính", lưới `grid-cols-2 sm:grid-cols-4 lg:grid-cols-6`, ảnh `aspect-[3/4] rounded-lg object-cover loading="lazy"`.
- Ticket: `issues/02`

**3. Trang chi tiết Product chưa được dựng giao diện**
- Vị trí: `src/features/products/views/ProductDetailView.vue:43-55`
- Hạng mục: Responsive / Bám design system
- Hiện trạng: hàng ảnh dùng `flex gap-3` không xuống dòng (tràn ở 375px), ảnh `h-32 w-32` không lazy. Bảng Variant là `<table>` thô: header "SKU" viết cứng, không viền, không `DataTable`, SKU không mono, số không căn phải.
- Đề xuất: lưới ảnh chỉ xem; bảng Variant theo pattern bảng dùng chung.
- Ticket: `issues/02`

**4. Dashboard là lưới card giống hệt nhau (kiểu AI generic)**
- Vị trí: `src/features/dashboard/views/DashboardView.vue:79-110`
- Hạng mục: Bám design system / Thứ bậc thị giác
- Hiện trạng:
  - 9 widget trong cùng một lưới `md:grid-cols-2 xl:grid-cols-4`, mỗi ô là card y hệt nhau. Chart rộng ngang một con số, nên không có điểm nhìn đầu tiên.
  - Thiếu câu tóm tắt, hàng đợi "Cần xử lý", KPI hero kèm chart 2 cột, và cặp đơn gần đây / sắp hết hàng (archetype đã duyệt trong `DESIGN.md` và `ui-ux-hardening/mockup-decision.md`).
  - Dòng 78: khi rỗng vẫn render lưới trống dưới `EmptyState`.
- Ticket: lưới trống ở `issues/01`; bố cục ở `ui-ux-hardening/issues/12`.

### P2 — lượt sau

**5. Cỡ số KPI lệch thang chữ**
- Vị trí: `src/features/dashboard/components/StatCard.vue:11`
- Hiện trạng: `text-3xl font-bold` cho mọi KPI. Contract quy định hero `text-4xl font-bold`, phụ `text-2xl font-semibold`. Mọi KPI trông quan trọng như nhau.
- Ticket: `issues/03`

**6. Tiêu đề section có hai kiểu khác nhau**
- Vị trí: `src/shared/components/form/FormSection.vue:7` so với `DashboardView.vue:86`
- Hiện trạng: FormSection dùng `font-display text-lg`; contract và card dashboard dùng `text-base font-semibold` (Inter). FormSection thiếu `bg-default`.
- Ticket: `issues/03`

**7. Các màn list chưa theo archetype List**
- Vị trí: 8 view list (Order, Customer, Inventory, Stock Movement, Promotion, User, Role, Category); chỉ `ProductListView` dùng `DataTableToolbar`.
- Hiện trạng: không có tiêu đề bảng, nút chọn cột, thanh thao tác hàng loạt hay tab bộ lọc đã lưu. Phân trang vẫn hiện khi đang tải hoặc lỗi (ví dụ `OrderListView.vue:47`).
- Ticket: phân trang ở `issues/01`; toolbar và tab ở `ui-ux-hardening/issues/08`.

**8. Icon cảnh báo Caps Lock quá nhạt**
- Vị trí: `src/features/auth/components/LoginForm.vue:100`
- Hiện trạng: icon mang ý nghĩa dùng `text-warning` (amber-500 ≈ 2.1:1). Chữ bên cạnh thì đạt.
- Chuẩn: WCAG 1.4.11 (3:1 cho thành phần không phải chữ).
- Đề xuất: `text-default`.
- Ticket: `issues/01`

### P3 — trau chuốt

**9.** `DashboardView.vue:85` dùng `space-y-3`; contract quy định trong khối dùng `space-y-4`. → `issues/03`

**10.** `DesignSystemView.vue:87` ví dụ KPI `text-3xl font-bold` lệch contract mà trang đang minh hoạ. → `issues/03`

## Lỗi lặp lại thành hệ thống

- **Màn chưa được làm lại thì lệch contract, màn đã làm lại thì đạt.** Mọi lỗi P1 nằm ở màn chưa qua đợt `ui-ux-hardening` (dashboard, chi tiết Product, gallery). Đây là khoảng trống rollout, không phải lỗi token hay component dùng chung.
- **Thứ bậc hành động bị dẹt.** Ở gallery và dashboard, mọi phần tử nặng như nhau: nút toàn solid primary, card toàn cùng cỡ, KPI toàn cùng cỡ. Contract có quy định thứ bậc (1 nút chính, KPI hero/phụ, lưới 2+1) nhưng các màn này chưa áp.
- **Màu trạng thái dùng làm chữ/nền đặc.** 2 chỗ (banner, icon Caps Lock) dùng bước 500 cho chữ hoặc icon, đúng điều `DESIGN.md` đã cảnh báo. Có thể thêm lint rule chặn `text-(success|warning|info|error)` và `variant="solid"` với 3 màu này.
- **Ảnh không theo quy ước.** Cả 3 nơi hiển thị ảnh lớn đều thiếu `loading="lazy"`, tỉ lệ 3:4 và bo góc. Nên có một component ảnh dùng chung.
- **Trạng thái của trang chưa đồng bộ với trạng thái của bảng.** `DataTable` xử lý loading/empty/error tốt, nhưng phần tử xung quanh (phân trang, lưới dashboard) không biết trạng thái đó.

## Những gì đã làm tốt (giữ nguyên)

- Không có màu palette thô, `rounded-xl`, `space-y-5`, shadow trang trí hay kích thước tuỳ ý, trừ `max-h` dạng calc của `DataTable` (đã ghi trong contract).
- `DataTable` xử lý một lần cho mọi list: thead dính, hover dòng, dòng được chọn, loading/empty/error, cuộn trong khung.
- Mọi `transition` có `motion-reduce:transition-none` và `duration-150`.
- Nút chỉ có icon đều có `aria-label`; nút toggle mật khẩu có `aria-pressed`; cảnh báo Caps Lock có `role="status"`.
- Sidebar, breadcrumb và store switcher có hover/focus rõ, dùng token `primary`.
- Widget dashboard có đủ loading/error/empty và được lọc theo quyền.

## Hướng dẫn cho lượt sửa tiếp theo

- **Ticket:** `issues/01` → `issues/02` → `issues/03` (01–03 độc lập; nên làm 03 trước `ui-ux-hardening/issues/12`). Sau đó `ui-ux-hardening/issues/12` (dashboard) và `ui-ux-hardening/issues/08` (list).
- **Lệnh `/impeccable` gợi ý:**
  - `harden` cho OfflineBanner, LoginForm, ImageGallery, ProductDetailView
  - `layout` cho dashboard
  - `typeset` cho StatCard và FormSection
  - `polish` cho các màn list
  - `init` để tạo `PRODUCT.md` (chưa có)
- **Lưu ý khi dùng `/design-taste-frontend`:** skill này nhắm tới website marketing (hero, ảnh lớn, hiệu ứng). CMS là màn Operate, nên chỉ dùng nó để rà kiểu "AI generic", không áp hero, shader hay motion trang trí. `DESIGN.md` vẫn thắng khi có xung đột (theo `CLAUDE.md`).
- **Kiểm tra sau khi sửa:** render ở 375px và 1280px, light và dark; đo tương phản thực tế cho banner và các badge trạng thái.
