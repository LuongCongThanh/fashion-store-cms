# Lịch sử CMS

Archive giữ quyết định, tiêu chí và bằng chứng còn giá trị. Nội dung mô tả thời điểm thực hiện; không dùng quyền/API mẫu, branch policy hoặc số đo cũ như trạng thái hiện tại.

## Theo đợt

| Đợt                       | Bắt đầu từ                                                                              | Giữ để tra gì?                                                            |
| ------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Dựng CMS ban đầu          | [Hồ sơ hợp nhất](cms-initial-build/README.md)                                           | Foundation và Pages: quyết định, acceptance, từng bước, review và metrics |
| Tích hợp auth             | [Plan/chỉ mục](auth-integration/README.md), [quyết định](auth-integration/decisions.md) | Lưu phiên, Hết phiên và kết quả đợt auth                                  |
| Research cấu trúc ban đầu | [Chỉ mục nghiên cứu](architecture-research/README.md)                                   | Phương án bị thay, nguồn và đánh đổi trước ADR                            |

## Cách dùng

- Tìm policy hiện hành ở [docs](../README.md) trước; chỉ quay lại archive khi cần lý do hoặc bằng chứng cũ.
- Hồ sơ mỗi bước gộp đặc tả/kế hoạch và kết quả/review, có heading phân biệt; quyết định và tham chiếu chung giữ một owner.
- `cms-initial-build/reference/` giữ các chương kỹ thuật của scaffold cũ, chia nhỏ để đọc. Chúng có thể chứa StoreScope hoặc API đã bỏ; đó là bằng chứng lịch sử.
- JSON và bảng metrics không được sửa thành số đo mới khi chỉ sắp xếp tài liệu.
- Nếu quyết định lịch sử vẫn còn hiệu lực, guide hoặc ADR hiện hành phải dẫn lại lý do cần thiết; không bắt người triển khai đoán policy từ snapshot.

Tiếp tục: [Quy chuẩn tài liệu](../guides/documentation.md).
