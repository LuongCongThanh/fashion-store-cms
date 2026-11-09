# Chuỗi 14 PR

Người phụ trách đã chọn 14 PR nối tiếp; mỗi diff chỉ có một plan. Tất cả là draft, chưa tự merge. Base gốc `dev` tại `97875842ec6cd774a5c1439929a31842a3680746`.

| Plan                                   | Nhánh                               | Base PR hiện tại                    | PR                                                          |
| -------------------------------------- | ----------------------------------- | ----------------------------------- | ----------------------------------------------------------- |
| 01 — Hoàn thiện Layout                 | `feat/cms-01-layout-completion`     | `dev`                               | https://github.com/LuongCongThanh/fashion-store-cms/pull/24 |
| 02 — Dashboard                         | `feat/cms-02-dashboard`             | `feat/cms-01-layout-completion`     | https://github.com/LuongCongThanh/fashion-store-cms/pull/25 |
| 03 — Nền tảng List & Table             | `feat/cms-03-list-table-foundation` | `feat/cms-02-dashboard`             | https://github.com/LuongCongThanh/fashion-store-cms/pull/26 |
| 04 — Nền tảng Form & Media             | `feat/cms-04-form-media-foundation` | `feat/cms-03-list-table-foundation` | https://github.com/LuongCongThanh/fashion-store-cms/pull/27 |
| 05 — Products — List                   | `feat/cms-05-products-list`         | `feat/cms-04-form-media-foundation` | https://github.com/LuongCongThanh/fashion-store-cms/pull/28 |
| 06 — Categories                        | `feat/cms-06-categories`            | `feat/cms-05-products-list`         | https://github.com/LuongCongThanh/fashion-store-cms/pull/29 |
| 07 — Products — Create / Edit / Detail | `feat/cms-07-products-form-detail`  | `feat/cms-06-categories`            | https://github.com/LuongCongThanh/fashion-store-cms/pull/30 |
| 08 — Orders                            | `feat/cms-08-orders`                | `feat/cms-07-products-form-detail`  | https://github.com/LuongCongThanh/fashion-store-cms/pull/31 |
| 09 — Customers                         | `feat/cms-09-customers`             | `feat/cms-08-orders`                | https://github.com/LuongCongThanh/fashion-store-cms/pull/32 |
| 10 — Inventory                         | `feat/cms-10-inventory`             | `feat/cms-09-customers`             | https://github.com/LuongCongThanh/fashion-store-cms/pull/33 |
| 11 — Promotions                        | `feat/cms-11-promotions`            | `feat/cms-10-inventory`             | https://github.com/LuongCongThanh/fashion-store-cms/pull/34 |
| 12 — Users & Roles                     | `feat/cms-12-users-roles`           | `feat/cms-11-promotions`            | https://github.com/LuongCongThanh/fashion-store-cms/pull/35 |
| 13 — Settings                          | `feat/cms-13-settings`              | `feat/cms-12-users-roles`           | https://github.com/LuongCongThanh/fashion-store-cms/pull/36 |
| 14 — Đối chiếu và chốt                 | `feat/cms-14-reconcile-finalize`    | `feat/cms-13-settings`              | https://github.com/LuongCongThanh/fashion-store-cms/pull/37 |

## Khi đến lượt merge

1. Reviewer duyệt và squash merge PR đến lượt vào `dev`. Không merge PR sau khi base vẫn là feature branch.
2. Lưu head cũ của các nhánh còn lại, rebase phần commit riêng lên base mới theo thứ tự để loại commit đã được squash.
3. Cập nhật các nhánh bằng force-with-lease đúng head dự kiến (không force trần); đổi base PR tiếp theo về `dev`.
4. Chạy lại kiểm tra trên head mới trước khi merge. Lặp đến plan 14; không merge cả chuỗi tự động.

Backend chưa có; E2E được hoãn theo quyết định của người phụ trách. Các giới hạn này phải được chốt khi duyệt; chưa archive hoặc đánh dấu done thay reviewer.
