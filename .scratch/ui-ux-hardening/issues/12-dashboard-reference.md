# 12 — Phase 5: Dashboard theo archetype

Status: ready-for-agent
Blocked by: 02, 06

Áp Dashboard A + câu tóm tắt:

- Hàng đợi "Cần xử lý" (badge `soft`).
- KPI hero + chart (điểm cao nhất tô `primary`, phần còn lại `accented`, có tóm tắt bằng chữ).
- KPI phụ: delta đi qua badge, không dùng chữ màu trạng thái.
- Đơn gần đây + sắp hết hàng.
- Mỗi widget có loading, empty và error.

Cần backend endpoint hàng đợi, hoặc tạm đếm từ list API; ghi vào Gap.

Test: DashboardView spec cho widget theo quyền, hàng đợi điều hướng tới list đã lọc.
