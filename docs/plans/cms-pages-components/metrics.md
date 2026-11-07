# Metrics

Cuối mỗi phiên làm plan, điền số liệu vào dòng của plan đó. Token lấy từ `/cost` hoặc usage của Claude Code (ước lượng nếu chia theo transcript). Số liệu chất lượng lấy sau khi PR merge vào `dev`.

## Token đã dùng

| #   | Plan                              | Số phiên | Input | Output | Cache read | Tổng tokens | Chi phí (USD) |
| --- | --------------------------------- | -------- | ----- | ------ | ---------- | ----------- | ------------- |
| 00  | Chia plan + viết spec             | 1        |       |        |            |             |               |
| 01  | Hoàn thiện Layout                 |          |       |        |            |             |               |
| 02  | Dashboard                         |          |       |        |            |             |               |
| 03  | Nền tảng List & Table             |          |       |        |            |             |               |
| 04  | Nền tảng Form & Media             |          |       |        |            |             |               |
| 05  | Products — List                   |          |       |        |            |             |               |
| 06  | Categories                        |          |       |        |            |             |               |
| 07  | Products — Create / Edit / Detail |          |       |        |            |             |               |
| 08  | Orders                            |          |       |        |            |             |               |
| 09  | Customers                         |          |       |        |            |             |               |
| 10  | Inventory                         |          |       |        |            |             |               |
| 11  | Promotions                        |          |       |        |            |             |               |
| 12  | Users & Roles                     |          |       |        |            |             |               |
| 13  | Settings                          |          |       |        |            |             |               |
| 14  | Đối chiếu và chốt                 |          |       |        |            |             |               |
|     | **Tổng**                          |          |       |        |            |             |               |

## Chất lượng

| #   | Plan                              | Unit test mới | E2E mới | Coverage (lines %) | Bundle chunk feature (kB gzip) | Lint/typecheck | Ngày merge |
| --- | --------------------------------- | ------------- | ------- | ------------------ | ------------------------------ | -------------- | ---------- |
| 01  | Hoàn thiện Layout                 |               |         |                    |                                |                |            |
| 02  | Dashboard                         |               |         |                    |                                |                |            |
| 03  | Nền tảng List & Table             |               |         |                    |                                |                |            |
| 04  | Nền tảng Form & Media             |               |         |                    |                                |                |            |
| 05  | Products — List                   |               |         |                    |                                |                |            |
| 06  | Categories                        |               |         |                    |                                |                |            |
| 07  | Products — Create / Edit / Detail |               |         |                    |                                |                |            |
| 08  | Orders                            |               |         |                    |                                |                |            |
| 09  | Customers                         |               |         |                    |                                |                |            |
| 10  | Inventory                         |               |         |                    |                                |                |            |
| 11  | Promotions                        |               |         |                    |                                |                |            |
| 12  | Users & Roles                     |               |         |                    |                                |                |            |
| 13  | Settings                          |               |         |                    |                                |                |            |
| 14  | Đối chiếu và chốt                 |               |         |                    |                                |                |            |

## Tiến độ danh mục

| Nhóm                    | Tổng mục trong nguồn | Đã làm | Bỏ (có lý do) |
| ----------------------- | -------------------- | ------ | ------------- |
| Layout (§2)             | 3 (+1 backlog)       |        |               |
| Shared (§3)             | 16                   |        |               |
| Views (§4)              | 31                   |        |               |
| Feature components (§4) | ~60                  |        |               |
