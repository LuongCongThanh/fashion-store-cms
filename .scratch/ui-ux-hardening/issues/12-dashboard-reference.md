# 12 — Phase 5: Dashboard theo archetype

Status: ready-for-agent
Blocked by: 02, 06

Áp Dashboard A + câu tóm tắt:

- Hàng đợi "Cần xử lý" (badge `soft`).
- KPI hero + chart (điểm cao nhất tô `primary`, phần còn lại `accented`, có tóm tắt bằng chữ).
- KPI phụ: delta đi qua badge, không dùng chữ màu trạng thái.
- Đơn gần đây + sắp hết hàng. Tồn `0` hiện nhãn "Hết" (badge), không hiện số `0` (break-ui #6, phần còn lại sau ticket 02).
- Mỗi widget có loading, empty và error.

Cần backend endpoint hàng đợi, hoặc tạm đếm từ list API; ghi vào Gap.

Test: DashboardView spec cho widget theo quyền, hàng đợi điều hướng tới list đã lọc.

## Comments

- 2026-11-09: Ticket 02 (#44) đã thêm formatter nhưng chưa có nhãn "Hết" cho tồn 0; chuyển phần đó sang ticket này.
- 2026-11-09: KPI phụ: `UPageGrid` + `UPageCard` + `UBadge` (như `HomeStats.vue`). KPI hero: kiểm `UChart` (dependency + bundle so với baseline #01) trước khi dùng; nặng quá thì chọn chart nhẹ hơn. Không lấy bố cục trang home của template.
