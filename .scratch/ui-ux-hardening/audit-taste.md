# Audit — `design-taste-frontend` (chỉ báo cáo)

Ngày 2026-11-10. Yêu cầu gốc: "redesign everything". Quyết định: audit + plan trước, chưa sửa code.

## Kết luận

Không cần đổi hướng thiết kế. `DESIGN.md` đã đủ; phần còn thiếu là **màn hình chưa theo archetype** và **form còn control native**. "Redesign" = chạy hết backlog Phase 4 (#07–#12) + một ticket mới (#16).

Skill `design-taste-frontend` nhắm landing page (hero ảnh, scroll moment, "một section mỗi màn hình"). Phần lớn luật của nó **trái** `DESIGN.md` (operational clarity thắng) nên bị loại. Chỉ giữ: kiểm tương phản, một hệ nút/card/radius, focus ring, không hành động chỉ hiện khi hover.

## Đã sạch (grep `src/**/*.vue`, bỏ `prototype/` và `DesignSystemView`)

- Không class palette thô, không hex/rgb, không `rounded-xl`, không `space-y-5`, không shadow/gradient trang trí.
- Không `outline-none` trần, không `text-success|warning|info|error` cho chữ (chỉ 1 icon ở `LoginForm.vue:100`, chấp nhận được vì là icon).
- Mọi `transition` đều có `motion-reduce`. Không hành động chỉ hiện khi hover.
- `toLocaleString` chỉ còn trong `prototype/` (fixture), không ở code thật.

## Lệch contract

| # | Mức | Chỗ | Lệch | Ticket |
|---|-----|-----|------|--------|
| 1 | Cao | `DashboardView.vue` | Lưới 4 cột card đồng đều. Thiếu câu tóm tắt, hàng đợi "Cần xử lý", KPI hero + chart 2 cột, đơn gần đây / sắp hết hàng. | #12 |
| 2 | Cao | `OrderDetailView.vue` | Badge và action nằm dưới header thay vì trong header; không có link quay lại, thanh tiến trình trạng thái, layout `lg:grid-cols-[1fr_22rem]` với sidebar dính. Ba `FormSection` xếp `md:grid-cols-3`. | #09 |
| 3 | Cao | 15 file form (`ProductForm`, `ProductSeoFields`, `ProductVariantTable`, `CategoryForm`, `CategorySelector`, `PromotionForm`, `RoleForm`, `PermissionMatrix`, `UserForm`, `UserRoleSelector`, `UserStoreSelector`, `StoreSettingsForm`, `LocalizationSettingsForm`, `StockAdjustDialog`, `ImageUploader`) | `<input>`/`<select>` trần, phần lớn không style, lỗi `role="alert"` không gắn field. #04 chỉ phủ filter + phân trang. | **#16 (mới)** |
| 4 | TB | `StatCard.vue:11` | `text-3xl font-bold`; contract: KPI hero `text-4xl font-bold`, KPI phụ `text-2xl font-semibold`. | #12 |
| 5 | TB | `DataTableToolbar.vue:52` | `font-display text-base` — display chỉ cho chữ ≥ 18px. | #08 |
| 6 | TB | `FormSection.vue:7` | `font-display text-lg`; contract: tiêu đề section/card `text-base font-semibold` (Inter). | #10 |
| 7 | TB | List views (Order, Customer, Inventory, Promotion, Role, User) | Chưa có tab bộ lọc đã lưu như Product list (chờ #07 duyệt). | #07 → #08 |
| 8 | Thấp | `ProductListView.vue` | 2 `UButton` ở header + bulk; OK (bulk là `outline`), ghi lại để #13 lint "1 primary mỗi màn". | #13 |

## Thứ tự đề xuất

1. **#07** — user review Product list (đang `needs-user-review`, chặn #08).
2. **#16** form controls — không bị chặn, làm song song; mở khoá #10.
3. **#12** dashboard, **#09** order detail — mỗi cái một PR, ảnh 1280 + 375, light/dark.
4. **#08** rollout list, **#10** product editor, **#11** tree/matrix.
5. **#13** quality gates: thêm lint chặn `<input`/`<select` trần trong `features/**` và `font-display` với cỡ < `text-lg`.

Không đổi token, palette hay font (Open question 1 vẫn chờ brand guideline).
