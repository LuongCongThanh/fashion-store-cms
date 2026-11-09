# 05 — Phase 3: pattern bảng nghiệp vụ dùng chung

Status: ready-for-agent
Blocked by: 02, 04

Cập nhật `DataTable` và các component liên quan theo `DESIGN.md` mục Components/Bảng:

- Compact: `py-1.5`, control `sm`.
- `thead` dính.
- Thanh thao tác hàng loạt thay vào chỗ tiêu đề bảng khi có dòng được chọn (bỏ khối `DataTableBulkActions` riêng).
- Cột tên: `RouterLink` + `line-clamp-1` + `title` (bỏ `<a href>`).
- Cột tiền căn phải.
- Bảng cuộn ngang trong khung của nó.
- Thêm thứ tự ưu tiên cột ở `sm` vào `DESIGN.md`.

Nguồn: hallmark #7, #10; break-ui #2.

Test: DataTable spec cho chọn dòng → thanh hàng loạt hiện, bỏ chọn → tiêu đề quay lại; link điều hướng không tải lại trang.

## Comments
- 2026-11-09: Dùng `UTable` với `rowSelection`, `columnVisibility`, pagination như `pages/customers.vue` của template, thay vì tự viết. Cân nhắc `UPopover` + `UCalendar` cho `FilterDateRange`.
