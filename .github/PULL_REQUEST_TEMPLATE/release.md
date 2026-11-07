<!-- Template cho PR release dev → main. Mở bằng: ?quick_pull=1&template=release.md
     Tiêu đề: chore(release): vX.Y.Z -->

# 🚀 Release vX.Y.Z

## 📦 Nội dung

<!-- Danh sách PR đã merge vào dev từ lần release trước: `git log main..dev --merges --oneline` -->

- #

## 💥 Breaking change

<!-- Thay đổi người dùng CMS hoặc BE cần biết; hoặc "Không" -->

## ⚙️ Việc trước khi deploy

- **Biến môi trường mới:** <!-- tên, giá trị trên từng môi trường; hoặc "Không" -->
- **Phụ thuộc BE:** <!-- endpoint/phiên bản BE phải deploy trước; hoặc "Không" -->
- **Migration phía client:** <!-- key localStorage `cms.*`, cache PWA cần xoá; hoặc "Không" -->

## 🧪 Kiểm sau deploy

- [ ] Đăng nhập, đổi store, đăng xuất
- [ ] Danh sách và chi tiết sản phẩm, đơn hàng tải được
- [ ] Không có lỗi mới trong console / network
- [ ] PWA cập nhật bản mới (nếu có thay đổi service worker)

## ↩️ Rollback

<!-- Cách quay lại: revert merge commit trên main, deploy lại tag trước (vX.Y.Z-1); điều kiện kích hoạt -->

## ✅ Checklist

- [ ] CI trên `dev` xanh
- [ ] Đã cập nhật CHANGELOG / ghi chú release
- [ ] Đã tạo tag sau khi merge
