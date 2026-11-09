# Metrics — CMS pages & components

Ngày đo: 2026-11-09. Mỗi dòng là kết quả đo trên đúng nhánh PR nối tiếp; chưa merge vào dev. Base gốc: `97875842ec6cd774a5c1439929a31842a3680746` (165 tests, coverage dòng 78,09%).

## Chất lượng theo PR

| Plan | Nội dung                          | Test mới | Tổng test ở checkpoint | Coverage dòng (%) | JS gzip toàn nhánh (kB) | Typecheck / lint / build | PR                                                          |
| ---- | --------------------------------- | -------- | ---------------------- | ----------------- | ----------------------- | ------------------------ | ----------------------------------------------------------- |
| 01   | Hoàn thiện Layout                 | 4        | 169                    | 85.25             | 259.8                   | PASS                     | https://github.com/LuongCongThanh/fashion-store-cms/pull/24 |
| 02   | Dashboard                         | 4        | 173                    | 83.64             | 447.04                  | PASS                     | https://github.com/LuongCongThanh/fashion-store-cms/pull/25 |
| 03   | Nền tảng List & Table             | 4        | 177                    | 84.8              | 447.33                  | PASS                     | https://github.com/LuongCongThanh/fashion-store-cms/pull/26 |
| 04   | Nền tảng Form & Media             | 2        | 179                    | 80.19             | 447.69                  | PASS                     | https://github.com/LuongCongThanh/fashion-store-cms/pull/27 |
| 05   | Products — List                   | 3        | 182                    | 82.04             | 490.44                  | PASS                     | https://github.com/LuongCongThanh/fashion-store-cms/pull/28 |
| 06   | Categories                        | 3        | 185                    | 85.23             | 509.87                  | PASS                     | https://github.com/LuongCongThanh/fashion-store-cms/pull/29 |
| 07   | Products — Create / Edit / Detail | —        | —                      | —                 | —                       | chưa chạy                | đang chuẩn bị                                               |
| 08   | Orders                            | —        | —                      | —                 | —                       | chưa chạy                | đang chuẩn bị                                               |
| 09   | Customers                         | —        | —                      | —                 | —                       | chưa chạy                | đang chuẩn bị                                               |
| 10   | Inventory                         | —        | —                      | —                 | —                       | chưa chạy                | đang chuẩn bị                                               |
| 11   | Promotions                        | —        | —                      | —                 | —                       | chưa chạy                | đang chuẩn bị                                               |
| 12   | Users & Roles                     | —        | —                      | —                 | —                       | chưa chạy                | đang chuẩn bị                                               |
| 13   | Settings                          | —        | —                      | —                 | —                       | chưa chạy                | đang chuẩn bị                                               |
| 14   | Đối chiếu và chốt                 | —        | —                      | —                 | —                       | chưa chạy                | đang chuẩn bị                                               |

E2E: hoãn theo lựa chọn của người phụ trách. Backend: người phụ trách xác nhận chưa có. Coverage là kết quả Vitest tại thời điểm kiểm nhánh, không phải chứng nhận backend hay kiểm UI thủ công.

## Token Codex

Đọc bộ đếm thực từ local session JSONL: lấy `total_token_usage` cuối mỗi session, trừ checkpoint trước lúc bắt đầu task cho phiên chính; cộng riêng các session review con đúng parent ID. Không cộng dồn các bản ghi cumulative và không cộng cached input lần nữa vào input. Phân bổ token triển khai theo từng plan: **không có số đo riêng** vì phiên triển khai ban đầu đã làm chung. Số này sẽ không được ước lượng hoặc chia đều.

Snapshot chi tiết và cách tái tạo được bổ sung trong PR 14. Chi phí USD: không có dữ liệu hóa đơn thực tế, không suy ra từ token ChatGPT bằng bảng giá API.

## Quy trình PR

14 nhánh / 14 draft PR nối tiếp, theo lựa chọn của người phụ trách. Mỗi PR sau nhắm nhánh trước để diff chỉ có một plan. Khi PR trước squash merge, restack phần chưa merge rồi đổi base PR đến lượt về dev. Không tự merge.
