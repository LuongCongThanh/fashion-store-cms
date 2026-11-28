# Traceability CMS: luật → kịch bản → tầng

**Trạng thái:** thiết kế đã duyệt (2026-11-28). Luật gốc nằm trong Backend (`be-demo/docs/business/`: `04-business-rules.md`, `05-order-lifecycle.md`, ma trận quyền và Quy tắc kiểm soát ở `02-actors-permissions.md` mục 3.2 và 4, `06-compliance.md`). Tầng: **U** unit, **C** component/view, **I** integration feature, **E** E2E giao diện (API mock), **J** E2E full-stack ở repo workspace.

Mức theo nhóm luật của workspace: phiên, phân quyền và dữ liệu Khách hàng là P0; thao tác Staff trên CMS là P1; danh mục và giao diện là P2. **Phụ thuộc**: task Backend phải xong trước khi test được dòng này (`—` nếu không cần). **Test**: chỉ trạng thái test; `Not assessed` = chưa audit, `PASS` = có test và bằng chứng chạy. Kịch bản handbook không áp dụng: `docs/testing/handbook-mapping.md` của repo workspace.

| Mã | Luật / US | Kịch bản | Tầng | Mức | Phụ thuộc | Test |
| --- | --- | --- | --- | --- | --- | --- |
| CMS-AUTH-01 | Phiên | Chưa đăng nhập vào route bảo vệ → trang đăng nhập; đăng nhập xong quay lại trang an toàn, không theo URL ngoài | U, E | P0 | — | Not assessed |
| CMS-AUTH-02 | Phiên | Nhiều request cùng 401 → refresh đúng một lần; refresh fail → về đăng nhập, xoá cache dữ liệu | C | P0 | — | Not assessed |
| CMS-AUTH-03 | Phiên | Đăng xuất xoá cache Vue Query và state; tài khoản khác đăng nhập không thấy dữ liệu cũ | I | P0 | — | Not assessed |
| CMS-AUTH-04 | `CUSTOMER` | Tài khoản Người mua đăng nhập CMS bị từ chối | C, E | P0 | — | Not assessed |
| CMS-PERM-01 | Ma trận 3.2 | Menu và route theo `permissions`: Admin, Staff, không quyền (bảng đại diện, không đủ ma trận) | U, E | P0 | — | Not assessed |
| CMS-PERM-02 | Ma trận 3.2 | Nút tạo/sửa/xoá Sản phẩm, Giá, Voucher, Tài khoản Staff ẩn với Staff | C | P0 | — | Not assessed |
| CMS-PERM-03 | Ma trận 3.2 | Backend trả 403 dù nút hiện (quyền đổi giữa phiên): báo lỗi, không cập nhật giao diện như đã lưu | C | P0 | — | Not assessed |
| CMS-PERM-04 | Ma trận 3.2 | Staff không quyền gọi hành động Admin → Backend từ chối, DB không đổi | J7 | P0 | — | Not assessed |
| CMS-PERM-05 | Ma trận 3.2 | Staff không có nút sửa Vai trò của mình hay người khác; gọi thẳng thì Backend từ chối và giao diện báo lỗi | C | P0 | — | Not assessed |
| CMS-ACC-01 | US-1001 | Admin tạo, khoá Tài khoản Staff; tài khoản bị khoá mất phiên ngay (Quy tắc kiểm soát) | C | P1 | — | Not assessed |
| CMS-ORD-01 | US-601, T6, T8 | Danh sách đơn cần xử lý; nút chuyển trạng thái chỉ hiện cho bước hợp lệ | C | P1 | BE task 33 | Not assessed |
| CMS-ORD-02 | T7, T9, T14 | Huỷ đơn bắt buộc lý do, có hộp xác nhận, chặn bấm hai lần | C | P1 | BE task 33 | Not assessed |
| CMS-ORD-03 | Mục 4.5 | Huỷ khi Vận đơn đang tạo: hiện lỗi Backend và trạng thái Vận đơn | C | P1 | BE task 32 | Not assessed |
| CMS-ORD-04 | US-608, US-609 | Hiện và gỡ Cờ cần xử lý (sai số tiền, phí ship dự phòng, Vận đơn sự cố) | C | P1 | BE task 33 | Not assessed |
| CMS-ORD-05 | T6–T8 | Staff xác nhận → đóng gói một đơn; huỷ một đơn khác có lý do | J5 | P1 | BE task 33 | Not assessed |
| CMS-REF-01 | BR-REF-03, BR-REF-06 | Ghi nhận Hoàn tiền bắt buộc mã giao dịch hoàn; bấm hai lần chỉ gửi một request | C | P1 | BE task 34 | Not assessed |
| CMS-RET-01 | BR-RET-08 | Chấp nhận theo dòng: số lượng 0 tới số gửi trả, chọn nhập lại Tồn kho; vượt bị chặn ở form và Backend báo lỗi | C | P1 | BE task 34 | Not assessed |
| CMS-RET-02 | BR-RET-07 | Hiển thị số hoàn đúng như Backend tính, không tự tính | C | P1 | BE task 34 | Not assessed |
| CMS-RET-03 | US-606 | Đổi trả → Chấp nhận một phần → ghi nhận Hoàn tiền | J9 | P1 | BE task 34 | Not assessed |
| CMS-INV-01 | BR-INV-11 | Giảm vượt Số lượng bán được: hiện số tối đa giảm được từ lỗi Backend | C | P1 | — | Not assessed |
| CMS-INV-02 | BR-INV-12 | Kiểm kê: nhập số đếm, xác nhận, hiện chênh lệch Backend trả | C | P1 | — | Not assessed |
| CMS-INV-03 | BR-INV-09 | Lịch sử Tồn kho hiển thị loại, số lượng, đơn, người thực hiện | C | P1 | BE task 51 | Not assessed |
| CMS-AUD-01 | Quy tắc kiểm soát, CMP-07 | Lịch sử thao tác hiện ai, lúc nào, giá trị trước và sau; lượt Staff xem dữ liệu Khách hàng có trong lịch sử | C | P1 | BE task 36 | Not assessed |
| CMS-PRD-01 | BR-CAT-01–03 | Form Sản phẩm: ít nhất một Biến thể, size × màu không trùng, SKU đúng định dạng; lỗi trùng SKU từ Backend vào đúng field | U, C | P1 | — | Not assessed |
| CMS-PRD-02 | BR-CAT-07, BR-CAT-09 | Đăng bán / ngừng bán; Sản phẩm đã có đơn không có nút xoá | C | P1 | — | Not assessed |
| CMS-PRD-03 | BR-CAT-04 | Giá 0, âm, số lẻ bị chặn ở form | U | P1 | — | Not assessed |
| CMS-PRC-01 | BR-PRC-01, BR-PRC-05, BR-PRC-06 | Giá khuyến mãi ≥ Giá bán bị chặn; trường bị khoá theo trạng thái sắp / đang / đã kết thúc | U, C | P1 | — | Not assessed |
| CMS-VCH-01 | BR-VCH-03, BR-VCH-09 | Form Voucher % kèm mức tối đa hoặc số tiền cố định; mã hiển thị in hoa | U, C | P1 | — | Not assessed |
| CMS-VCH-02 | BR-VCH-11 | Voucher đã có lượt: khoá mã và các trường không được sửa, không có nút xoá | C | P1 | — | Not assessed |
| CMS-CAT-01 | US-801, BR-CAT-10 | Danh mục: chọn cha không tạo vòng; ẩn danh mục báo ẩn cả nhánh; bản dịch Anh cần rà soát được đánh dấu | C | P2 | — | Not assessed |
| CMS-OPT-01 | BR-CAT-11 | Size và màu đã dùng chỉ có nút ẩn, không có nút xoá | C | P1 | — | Not assessed |
| CMS-CUS-01 | US-1101, US-1102 | Thông tin Khách hàng: chỉ hiện trường cần thiết; xuất dữ liệu không lộ trường nhạy cảm | C | P0 | — | Not assessed |
| CMS-UI-01 | Chung | Mỗi màn hình danh sách: loading, rỗng, lỗi có nút thử lại, thành công | C | P2 | — | Not assessed |
| CMS-UI-02 | Chung | Lọc và phân trang đồng bộ URL; request cũ trả về sau không ghi đè kết quả mới | I | P2 | — | Not assessed |
| CMS-UI-03 | Chung | Sửa cùng lúc: Backend báo xung đột → hiện lỗi và cho tải lại | C | P1 | — | Not assessed |

## N/A

- Cross-browser cho CMS: chỉ Chromium; CMS dùng nội bộ trên trình duyệt đã chọn.
