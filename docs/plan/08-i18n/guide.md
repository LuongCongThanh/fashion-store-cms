# 08 — Hướng dẫn thực hiện

1. Kiểm tra mọi plan trong `Blocked by` (05) đã `Status: done`.
2. Tạo nhánh riêng từ `main` (D27), ví dụ `chore/i18n`.
3. Đổi `Status:` trong `plan.md` thành `in-progress`.
4. Làm theo mục **Làm gì** trong [plan.md](./plan.md); tra phần tham chiếu ngay trong file đó.
5. Chạy hết mục **Kiểm tra**, ghi kết quả vào [report.md](./report.md).
6. Ghi token đã dùng vào [metric.md](./metric.md).
7. Commit theo Conventional Commits (§C.2). **Không** thêm `Co-Authored-By: Claude…` hay tên Claude vào commit/PR (xem [spec.md](../spec.md#lưu-ý-bắt-buộc)).
8. Mở PR, squash merge sau khi được duyệt; đổi `Status:` thành `done`.
