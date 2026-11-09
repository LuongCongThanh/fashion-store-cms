# Audit Phase 1 — `hallmark` (chỉ báo cáo)

Ngày 2026-11-09. Phạm vi gồm:

- `DESIGN.md`
- `layouts/`
- Dashboard, Product list, Order detail (code trên `dev`, chưa áp dụng phương án đã chọn)

Trọng tâm: độ tương phản, focus, mobile. Không sửa code. Không dùng theme catalog của Hallmark, vì `DESIGN.md` là nguồn chuẩn.

**Ghi chú về phương pháp:**

- Tỉ lệ tương phản là tính toán dựa trên màu mặc định của Nuxt UI (màu trạng thái ở light mode dùng bước 500). Chưa đo bằng công cụ. Phase 6 sẽ đo lại bằng axe.
- Các gate dành cho trang marketing (hero, stamp macrostructure, đa dạng hoá theme) không áp dụng cho CMS nên bỏ qua.

## Critical

1. **Màu trạng thái dùng làm chữ không đạt AA.** Nằm ở `DESIGN.md` mục Tokens/Colors (dòng `success`/`warning`/`error`: "delta tăng/giảm") và ở các phương án đã chọn (`text-success`, `text-warning`, `text-error` cho delta, tồn kho, "Hết").
   - Trên nền trắng: amber-500 ≈ 2.1:1, emerald-500 ≈ 2.5:1, sky-500 ≈ 2.8:1, red-500 ≈ 3.8:1. Ngưỡng cần là 4.5:1.
   - **Sửa:** thêm luật vào `DESIGN.md`: "Màu trạng thái chỉ dùng làm nền/viền/badge `subtle`. Chữ trạng thái phải là badge, hoặc token chữ riêng ở bước ≥ 700 khi light mode (≥ 300 khi dark mode)." Hoặc đẩy `--ui-success|warning|error|info` lên bước 600/700 trong `main.css`, như cách đã làm với `primary`.
2. **Badge `solid` warning/info chữ trắng không đạt.** Nằm ở `DESIGN.md` mục Components/Badge ("đếm hàng đợi dùng `variant="solid"`") và ở hàng "Cần xử lý" của Dashboard A.
   - Chữ trắng trên amber-500 ≈ 2.1:1, trên sky-500 ≈ 2.8:1.
   - **Sửa:** badge đếm dùng `variant="soft"`/`subtle`, hoặc chỉ cho phép `solid` với `error`/`neutral`/`primary` (ở bước ≥ 600).
3. **Không có điều hướng trên mobile.** Nằm ở `layouts/components/AppSidebar.vue` (`hidden … lg:flex`). Dưới 1024px không còn cách nào mở menu.
   - `DESIGN.md` mục Layout đã ghi "dưới `lg` thì sidebar thành drawer", nhưng code chưa có.
   - **Sửa:** Phase 2, làm drawer kèm nút mở trong `AppHeader`, có focus trap và trả focus về nút mở khi đóng.

## Major

4. **Header vỡ ở 375px.** Nằm ở `AppHeader.vue`: `px-6`, Store switcher, breadcrumb, 2 `<select>` và User menu nằm trên một hàng, không có `min-w-0`, không ẩn bớt hay xuống dòng.
   - **Sửa:** Phase 2. Thêm luật thứ tự ưu tiên vào `DESIGN.md`: trên mobile, locale và theme chuyển vào User menu.
5. **Control tự viết dùng `<select>` trần.** Gặp ở `LanguageSwitcher`, `ThemeSwitcher`, `ProductFilters`, `DataTablePagination`. Các control này không có focus ring của Nuxt UI và cũng không có style. Lệch với `DESIGN.md` ("ưu tiên Nuxt UI primitive", "giữ focus ring").
   - **Sửa:** Phase 3, thay bằng `USelect`/`UInput`.
6. **Bảng và tiền trong Order detail không theo contract.**
   - `OrderItems.vue` là `<table>` trần: không có `tabular-nums`, giá không căn phải, SKU không dùng mono.
   - `OrderSummary.vue` hiển thị tiền bằng `toLocaleString()` không có đơn vị ₫, cũng không có `tabular-nums`.
   - **Sửa:** Phase 4.3, lấy archetype Detail làm chuẩn.
7. **Thanh thao tác hàng loạt không giống contract.** `DataTableBulkActions.vue` là một khối `bg-muted` riêng nằm trên bảng. `DESIGN.md` lại quy định thanh này thay vào chỗ tiêu đề bảng.
   - **Sửa:** Phase 3, hoặc ghi rõ đây là ngoại lệ.
8. **`DESIGN.md` thiếu luật focus cụ thể.** Hiện chỉ có câu "giữ focus ring của Nuxt UI". Không quy định gì cho link ô tự viết (hàng đợi), tab tự viết hay checkbox trong bảng, và không nêu độ tương phản tối thiểu của ring.
   - **Sửa:** thêm "Element tự viết dùng `focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2`; ring ≥ 3:1 so với nền".
9. **Tab tự viết thiếu điều hướng bằng phím mũi tên.** `DESIGN.md` mô tả "tab bộ lọc đã lưu" nhưng không ghi ARIA. Prototype đang dùng `role="tab"` mà không có phím ←/→ và không có `tabindex` roving.
   - **Sửa:** ghi vào `DESIGN.md`: "dùng `UTabs`, hoặc nếu là link thì dùng `<nav>` + `aria-current`, không dùng `role=tab` tự viết".

## Minor

10. **Mobile của bảng chỉ dựa vào cuộn ngang.** `DESIGN.md` chưa có thứ tự ưu tiên cột (ẩn cột nào ở `sm`). **Sửa:** thêm mục ưu tiên cột cho archetype List.
11. **Còn dùng `rounded-xl`.** Ở `FormSection.vue` và `DashboardView.vue`. Đã ghi nhận trong `DESIGN.md`, sẽ sửa ở Phase 3.
12. **Dashboard loading chỉ là chữ.** `DashboardView.vue` dùng `<p role="status">` thay vì `LoadingState`/skeleton. **Sửa:** Phase 5.
13. **`text-dimmed` cho số thứ tự trang trí** (`DESIGN.md` Typography) chỉ chấp nhận được khi có `aria-hidden`. Nên ghi rõ điều này.

## Đếm

**3 critical · 6 major · 4 minor.**

Hai lỗi critical (1, 2) nằm **trong chính `DESIGN.md`**, nên cần sửa contract trước khi merge PR. Các lỗi còn lại thuộc về code hiện có và đã được phân vào Phase 2–5.
