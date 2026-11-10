# 02 — Gallery ảnh và chi tiết Product

Status: completed
Blocked by: —

Xem `../spec.md`, lát 2 (story 10–28).

- Gallery: menu `⋯` mỗi ảnh (đặt chính, chuyển trái/phải, xoá), xoá qua `useConfirm`, badge "Ảnh chính", lưới responsive, ảnh 3:4 lazy. Giữ nguyên props/events.
- Chi tiết Product: lưới ảnh chỉ xem; bảng Variant theo pattern bảng dùng chung, header i18n, SKU mono, số căn phải `tabular-nums`.

Test: gallery spec (4 action, disabled đúng, xoá chỉ emit sau khi xác nhận); ProductDetailView spec (header i18n). Kiểm thủ công ở 375px và 1280px.

## Comments

### 2026-11-10 — Implementation

Đã thay 4 nút bằng menu, xác nhận xoá qua useConfirm, thêm badge ảnh chính, ảnh 3:4 lazy, empty state và chế độ readonly. Chi tiết Product dùng lại gallery qua public interface UseMediaComponents và DataTable với header i18n, SKU mono, tiền/số qua formatter.

TDD: menu/badge, xoá trước xác nhận và readonly/lazy đều có test đỏ trước khi sửa. Regression kiểm thêm huỷ/xác nhận, keyboard chọn ảnh chính/di chuyển và hai biên. ProductDetailView kiểm cả vi/en và định dạng tiền.

Chromium kiểm detail/editor ở 375px và 1280px, light/dark: ảnh 3:4, không tràn ngang, menu mở bằng bàn phím; ảnh chụp được kiểm trực quan.

Validation: 58 file / 277 unit test qua; build (gồm vue-tsc), ESLint và Prettier qua; 4 cấu hình Chromium qua.
