# Kết quả rà soát tài liệu CMS

Ngày: 26/11/2026. Phạm vi: 115 file ban đầu trong `docs/`; người phụ trách yêu cầu sửa trực tiếp và chỉ giữ lịch sử còn giá trị. Không sửa source, không commit/push/PR.

## Nguồn chuẩn sau cleanup

- `docs/README.md` là entrypoint; CONVENTIONS giữ policy, FE_architecture giữ tổng quan và liên kết owner.
- ADR 0001–0003 và migration plan giữ thiết kế đã duyệt, chưa tuyên bố source đã migrate.
- navigation-flow đối chiếu Routes/Guards, route modules, Permission và Session; quyền tạm không được API cấp.
- Báo cáo, metrics và quyết định lịch sử được giữ; banner phân biệt chúng với hướng dẫn hiện hành.

## Xóa, gộp và lưu trữ

- Gộp `docs/plans/auth-backend-integration-plan.md` vào `auth-backend-integration/plan.md`, rồi xóa wrapper; giữ done/PR58, chỉ mục và follow-up typing.
- Chuyển research ban đầu từ `docs/research/cms-structure-and-naming.md` sang `docs/archive/research/`; sửa incoming và outgoing links.
- 12 plan scaffold thay phần tham chiếu chép lặp (1.845 dòng cũ, kể cả dòng trống) bằng link đến scaffold-plan; giữ hướng dẫn riêng và dòng glossary độc nhất của auth skeleton.
- FE_architecture bỏ role/DTO/endpoint/command scaffold cũ; giữ lý do chọn stack, session/API/form/upload, owner và số mục để tra các tham chiếu § lịch sử.
- CONVENTIONS bỏ cây file và danh sách dependency chép lặp; cập nhật route-module exception, upload products, API readiness và E2E.
- Giữ toàn bộ report/spec scaffold, quyết định auth, số liệu JSON và prototype acceptance vì có bằng chứng/tiêu chí độc nhất.

## Phân loại từng file ban đầu

| File                                                                    | Xử lý                        | Lý do                                                                                              |
| ----------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `docs/guides/README.md`                                                   | Cập nhật + tinh gọn          | Đối chiếu source/config; loại ví dụ lỗi thời và phần trùng owner.                                  |
| `docs/architecture/README.md`                                               | Cập nhật + tinh gọn          | Đối chiếu source/config; loại ví dụ lỗi thời và phần trùng owner.                                  |
| `docs/adr/0001-domain-workflows-and-vue-naming.md`                      | Giữ                          | ADR/agent policy là owner riêng; không thấy phần được thay thế cần xóa trong scope này.            |
| `docs/adr/0002-state-runtime-and-session.md`                            | Giữ                          | ADR/agent policy là owner riêng; không thấy phần được thay thế cần xóa trong scope này.            |
| `docs/adr/0003-backend-api-boundary.md`                                 | Giữ                          | ADR/agent policy là owner riêng; không thấy phần được thay thế cần xóa trong scope này.            |
| `docs/agents/domain.md`                                                 | Giữ                          | ADR/agent policy là owner riêng; không thấy phần được thay thế cần xóa trong scope này.            |
| `docs/agents/issue-tracker.md`                                          | Giữ                          | ADR/agent policy là owner riêng; không thấy phần được thay thế cần xóa trong scope này.            |
| `docs/archive/cms-initial-build/foundation/01-init-project.md`                         | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/01-init-project.md`                       | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/01-init-project.md`                         | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/02-lint-format-hooks.md`                    | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/02-lint-format-hooks.md`                  | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/02-lint-format-hooks.md`                    | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/03-github-ci.md`                            | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/03-github-ci.md`                          | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/03-github-ci.md`                            | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/04-test-env-foundation.md`                  | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/04-test-env-foundation.md`                | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/04-test-env-foundation.md`                  | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/05-session-http-runtime.md`                 | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/05-session-http-runtime.md`               | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/05-session-http-runtime.md`                 | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/06-errors-toast-dialog.md`                  | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/06-errors-toast-dialog.md`                | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/06-errors-toast-dialog.md`                  | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/07-css-design-system.md`                    | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/07-css-design-system.md`                  | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/07-css-design-system.md`                    | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/08-i18n.md`                                 | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/08-i18n.md`                               | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/08-i18n.md`                                 | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/09-auth-skeleton.md`                        | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/09-auth-skeleton.md`                      | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/09-auth-skeleton.md`                        | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/10-e2e-coverage.md`                         | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/10-e2e-coverage.md`                       | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/10-e2e-coverage.md`                         | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/11-pwa-noindex.md`                          | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/11-pwa-noindex.md`                        | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/11-pwa-noindex.md`                          | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/12-navigation-devtools.md`                  | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/12-navigation-devtools.md`                | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/12-navigation-devtools.md`                  | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/13-gen-api-types.md`                        | Gộp tham chiếu + giữ lịch sử | Phần chung trỏ scaffold-plan, giữ bước riêng; thêm nhãn lịch sử.                                   |
| `docs/archive/cms-initial-build/foundation/13-gen-api-types.md`                      | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/13-gen-api-types.md`                        | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/14-reconcile-finalize.md`                   | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/14-reconcile-finalize.md`                 | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation/14-reconcile-finalize.md`                   | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/foundation.md`                                         | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/metrics/foundation.md`                                  | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/archive/cms-initial-build/README.md`                                         | Giữ + nhãn lịch sử           | Quyết định D1–D41, tiêu chí/báo cáo và accepted deviations còn giá trị.                            |
| `docs/architecture/navigation.md`                                               | Cập nhật + tinh gọn          | Đối chiếu source/config; loại ví dụ lỗi thời và phần trùng owner.                                  |
| `docs/archive/auth-integration/decisions.md`                      | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/auth-integration/README.md`                           | Gộp chỉ mục + nhãn lịch sử   | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/auth-integration/report.md`                         | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/auth-integration/spec.md`                           | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/plans/auth-backend-integration-plan.md`                           | Gộp rồi xóa                  | Wrapper không có incoming link; nội dung độc nhất chuyển vào plan chính.                           |
| `docs/archive/cms-initial-build/screens/01-layout-completion.md`          | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/01-layout-completion.md`        | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/01-layout-completion.md`          | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/02-dashboard.md`                  | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/02-dashboard.md`                | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/02-dashboard.md`                  | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/03-list-table-foundation.md`      | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/03-list-table-foundation.md`    | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/03-list-table-foundation.md`      | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/04-form-media-foundation.md`      | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/04-form-media-foundation.md`    | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/04-form-media-foundation.md`      | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/05-products-list.md`              | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/05-products-list.md`            | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/05-products-list.md`              | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/06-categories.md`                 | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/06-categories.md`               | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/06-categories.md`                 | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/07-products-form-detail.md`       | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/07-products-form-detail.md`     | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/07-products-form-detail.md`       | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/08-orders.md`                     | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/08-orders.md`                   | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/08-orders.md`                     | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/09-customers.md`                  | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/09-customers.md`                | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/09-customers.md`                  | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/10-inventory.md`                  | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/10-inventory.md`                | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/10-inventory.md`                  | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/11-promotions.md`                 | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/11-promotions.md`               | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/11-promotions.md`                 | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/12-users-roles.md`                | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/12-users-roles.md`              | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/12-users-roles.md`                | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/13-settings.md`                   | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/13-settings.md`                 | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/13-settings.md`                   | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/14-reconcile-finalize.md`         | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/14-reconcile-finalize.md`       | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens/14-reconcile-finalize.md`         | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/api-contracts.md`                      | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/review.md`                        | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/review.md`                | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/catalog/README.md` | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/metrics/screens.md`                            | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/pull-requests.md`                           | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/review.md`                     | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/screens.md`                               | Giữ + nhãn lịch sử           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/metrics/token-metrics.json`                    | Giữ nguyên số liệu           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/archive/cms-initial-build/metrics/validation-metrics.json`               | Giữ nguyên số liệu           | Giữ tiêu chí/quyết định/kết quả ban đầu; không dùng quyền/API tạm hoặc trạng thái PR như hiện tại. |
| `docs/plans/api-restructure/README.md`                                    | Cập nhật trạng thái          | Plan còn việc mở; chỉ rõ snapshot và tracker, bỏ bước tạo DESIGN đã làm.                           |
| `docs/plans/structure-migration/README.md`                                 | Giữ + sửa liên kết           | Thiết kế/research còn giá trị; chỉ đổi link nghiên cứu đã chuyển archive.                          |
| `docs/plans/ui-hardening/README.md`                                    | Cập nhật trạng thái          | Plan còn việc mở; chỉ rõ snapshot và tracker, bỏ bước tạo DESIGN đã làm.                           |
| `docs/research/cms-structure-and-naming.md`                             | Chuyển archive               | Đã superseded; giữ phương án/nguồn nghiên cứu độc nhất, sửa liên kết.                              |
| `docs/research/cms-architecture/README.md`                           | Giữ + sửa liên kết           | Thiết kế/research còn giá trị; chỉ đổi link nghiên cứu đã chuyển archive.                          |

## File mới

- `docs/README.md`: entrypoint theo mục đích, owner và trạng thái tài liệu.
- `docs/plans/wayfinding/cms-docs-cleanup/map.md`, ticket và audit này: bằng chứng thay đổi, không phải policy ứng dụng.

## Kiểm tra

- Đã rà 115/115 file ban đầu; sau cleanup vẫn có 115 file (xóa một wrapper, thêm một README, chuyển một research).
- 0 local file target bị thiếu trong Markdown docs; 0 heading link không khớp sau khi bỏ qua code fences và external URLs.
- `git diff --check` pass.
- Prettier chạy riêng với `--ignore-path /dev/null` cho README, architecture, navigation và hồ sơ cleanup vì `.prettierignore` của repo chỉ format source.
- 63 file report/spec/decisions/JSON khớp HEAD sau khi bỏ banner lịch sử, xác nhận không viết lại dữ liệu nghiệm thu/số đo.
- Không có thay đổi source/config ứng dụng. Không chạy lại application tests/build vì thay đổi chỉ là Markdown; không tuyên bố runtime đã được kiểm lại.

## Giới hạn

Đối chiếu source tĩnh tại checkout này; không xác nhận merge/PR status trực tiếp trên remote, trạng thái production, kết quả test ứng dụng mới hoặc API runtime. Giữ nguyên số liệu lịch sử; không cập nhật các con số như thể vừa đo lại. Các file workspace lịch sử không còn tồn tại được ghi là nguồn lịch sử dạng text, thay cho link hỏng.
