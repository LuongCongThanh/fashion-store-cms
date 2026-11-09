# Metrics — CMS pages & components

Ngày đo: 2026-11-09. Mỗi dòng là kết quả đo trên đúng nhánh PR nối tiếp; chưa merge vào dev. Base gốc: `97875842ec6cd774a5c1439929a31842a3680746` (165 tests, coverage dòng 78,09%).

## Chất lượng theo PR

| Plan | Nội dung                          | Test mới | Tổng test ở checkpoint | Coverage dòng (%) | JS gzip toàn nhánh (kB) | Typecheck / lint / build / format | PR                                                          |
| ---- | --------------------------------- | -------- | ---------------------- | ----------------- | ----------------------- | --------------------------------- | ----------------------------------------------------------- |
| 01   | Hoàn thiện Layout                 | 4        | 169                    | 85.25             | 259.8                   | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/24 |
| 02   | Dashboard                         | 4        | 173                    | 83.64             | 447.04                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/25 |
| 03   | Nền tảng List & Table             | 4        | 177                    | 84.8              | 447.33                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/26 |
| 04   | Nền tảng Form & Media             | 2        | 179                    | 80.19             | 447.69                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/27 |
| 05   | Products — List                   | 3        | 182                    | 82.04             | 490.44                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/28 |
| 06   | Categories                        | 3        | 185                    | 85.23             | 509.87                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/29 |
| 07   | Products — Create / Edit / Detail | 7        | 192                    | 85.9              | 654.8                   | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/30 |
| 08   | Orders                            | 3        | 195                    | 85.6              | 661.06                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/31 |
| 09   | Customers                         | 2        | 197                    | 85.26             | 665.54                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/32 |
| 10   | Inventory                         | 2        | 199                    | 85.25             | 670.57                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/33 |
| 11   | Promotions                        | 4        | 203                    | 85.36             | 676.05                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/34 |
| 12   | Users & Roles                     | 6        | 209                    | 85.0              | 686.77                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/35 |
| 13   | Settings                          | 2        | 211                    | 84.55             | 692.01                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/36 |
| 14   | Đối chiếu và chốt                 | 10       | 221                    | 85.67             | 692.01                  | PASS                              | https://github.com/LuongCongThanh/fashion-store-cms/pull/37 |

E2E: hoãn theo lựa chọn của người phụ trách. Backend: người phụ trách xác nhận chưa có. Coverage là kết quả Vitest tại thời điểm kiểm nhánh, không phải chứng nhận backend hay kiểm UI thủ công.

## Token Codex — số đo thực

Snapshot: `2026-11-09T00:29:01.527Z`. Task bắt đầu lúc `2026-11-08T18:58:56.143Z` (09/11/2026, 01:58:56 giờ Việt Nam). Nguồn: event `token_count` của một phiên chính và hai phiên review con. [JSON chi tiết](./token-metrics.json).

| Chỉ số                                                  |         Tokens |
| ------------------------------------------------------- | -------------: |
| Input (đã bao gồm cached input)                         |     45,163,553 |
| Cached input — phần nằm trong input                     |     44,854,144 |
| Input không cache                                       |        309,409 |
| Output                                                  |        200,078 |
| Reasoning output — trường phụ, không cộng lại vào total |         74,262 |
| **Tổng task: input + output**                           | **45,363,631** |

Lấy bản ghi cumulative cuối mỗi session, trừ checkpoint trước task cho phiên chính; cộng riêng từng child session đúng parent ID. Không cộng tất cả event cumulative, không cộng cached input lần thứ hai. Bản ghi trước task (cài skill) được loại khỏi số task. Snapshot chưa gồm event usage chưa được Codex phát tại thời điểm chạy.

| Phiên                                            | Input trong task | Cached input |  Output |  Tổng task |
| ------------------------------------------------ | ---------------: | -----------: | ------: | ---------: |
| `01a1bc84-28f7-7690-b41f-c9794f943eaa` (primary) |       43,946,617 |   43,720,832 | 196,379 | 44,142,996 |
| `01a1bcad-d133-7973-9be0-d3bb7604b2a5` (review)  |          490,427 |      448,256 |   1,659 |    492,086 |
| `01a1bcad-fa56-7cd3-9a1f-0eef6b2ba314` (review)  |          726,509 |      685,056 |   2,040 |    728,549 |

### Theo từng plan

**Không có số đo triển khai độc lập cho từng plan.** Phần triển khai đầu tiên đã làm chung một phiên và review sửa nhiều plan xen kẽ; không thể chia chính xác 14 con số từ aggregate. Không chia đều, không ước lượng và không dùng số token của một lần kiểm tra thay cho token triển khai.

Chi phí USD: **không có dữ liệu hóa đơn**. Token hoạt động Codex không được tự đổi thành tiền ChatGPT bằng bảng giá API. [OpenAI Docs về usage/session commands](https://learn.chatgpt.com/docs/developer-commands).

### Tái tạo snapshot

```sh
npm run metrics:tokens -- --session "$HOME/.codex/sessions/2026/11/09/rollout-2026-11-09T01-55-40-01a1bc84-28f7-7690-b41f-c9794f943eaa.jsonl" --since 2026-11-08T18:58:56.143Z --out docs/plans/cms-pages-components/token-metrics.json
```

Script chỉ xuất counters/ID và phương pháp tính; không đưa prompt, tool output, access token hoặc transcript vào repo.

mỗi session, trừ checkpoint trước task cho phiên chính; cộng riêng từng child session đúng parent ID. Không cộng tất cả event cumulative, không cộng cached input lần thứ hai. Bản ghi trước task (cài skill) được loại khỏi số task. Snapshot chưa gồm event usage chưa được Codex phát tại thời điểm chạy.

| Phiên                                            | Input trong task | Cached input |  Output |  Tổng task |
| ------------------------------------------------ | ---------------: | -----------: | ------: | ---------: |
| `01a1bc84-28f7-7690-b41f-c9794f943eaa` (primary) |       43,946,617 |   43,720,832 | 196,379 | 44,142,996 |
| `01a1bcad-d133-7973-9be0-d3bb7604b2a5` (review)  |          490,427 |      448,256 |   1,659 |    492,086 |
| `01a1bcad-fa56-7cd3-9a1f-0eef6b2ba314` (review)  |          726,509 |      685,056 |   2,040 |    728,549 |

## Đọc số liệu bundle và coverage

JS gzip là tổng các chunk JavaScript của toàn nhánh, bao gồm chunk tải động; không phải tải ban đầu của riêng feature. Coverage của mỗi checkpoint có thể thay đổi khi nền tảng chưa được feature sau sử dụng; giá trị được ghi nguyên số đo, không loại file để tăng điểm. Chi tiết statements/branches/functions nằm trong report và [validation-metrics.json](./validation-metrics.json).

Knip là kiểm tra bắt buộc ở plan 14; CI đặt job knip không chặn merge. Ở PR nền trước khi feature sau sử dụng các export, knip có thể báo phần chưa có consumer; không tắt rule để làm xanh giả. CI sẵn có cũng tự chạy smoke E2E khi mở PR; E2E nghiệp vụ mới vẫn hoãn theo lựa chọn đã chốt.

Không có ngày merge vì các PR đang draft. Archive chỉ thực hiện sau khi chuỗi PR đã được duyệt và các phần DoD hoãn đã được chốt; không đổi `done` để che phần backend/E2E chưa kiểm.
