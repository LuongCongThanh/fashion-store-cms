# Dựng CMS ban đầu — hồ sơ hợp nhất

Hợp nhất archive ngày 26/11/2026. Hai giai đoạn vẫn giữ ranh giới: **F — Foundation** dựng nền tảng; **P — Pages** dựng màn hình prototype. Đây là lịch sử, không phải backlog hoặc policy hiện hành.

## Chọn phần cần đọc

| Cần tra                         | Nguồn                                                                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Phạm vi và quy trình Foundation | [Nền tảng](foundation.md)                                                                                                     |
| Phạm vi và acceptance Pages     | [Màn hình](screens.md), [catalog](catalog/README.md)                                                                          |
| Quyết định D1–D41 và lý do      | [Quyết định](reference/decisions.md), [đánh đổi](reference/decision-rationale.md)                                             |
| Review và giới hạn prototype    | [Review](review.md)                                                                                                           |
| API tạm của prototype           | [API snapshot](api-contracts.md)                                                                                              |
| PR và base lịch sử              | [Chuỗi PR](pull-requests.md)                                                                                                  |
| Số đo nền tảng                  | [Metrics F](metrics/foundation.md)                                                                                            |
| Số đo màn hình                  | [Metrics P](metrics/screens.md), [token JSON](metrics/token-metrics.json), [validation JSON](metrics/validation-metrics.json) |

## Cách đọc hồ sơ

- Mỗi bước chỉ có **một file**, gồm đặc tả/kế hoạch và kết quả/review. Hai phần giữ nguyên trạng thái tại thời điểm nguồn được viết; không suy rằng PR đã merge từ trạng thái code đã xong.
- F01 và P01 là hai bước khác nhau; không gộp ID hoặc cộng số test/bundle của các nhánh khác nhau.
- Các chú thích template được gộp ở đây: spec nêu mục tiêu/phạm vi/tiêu chí/phụ thuộc; report ghi kết quả, lệch kế hoạch và việc còn tồn. Không coi tiêu chí là bằng chứng đã pass.
- Số liệu, ngày chạy và giới hạn Backend/E2E là dữ liệu lịch sử. Không cập nhật thành số đo mới chỉ vì sắp xếp archive.
- Tên StoreScope, Promotions/Users và DTO/endpoint cũ có thể còn trong snapshot. Nguồn hiện hành ở [docs](../../README.md); không dùng snapshot để triển khai lại chức năng đã bỏ.

## Hồ sơ Foundation

| Bước | Nội dung                                                              |
| ---- | --------------------------------------------------------------------- |
| F01  | [Khởi tạo dự án](foundation/01-init-project.md)                       |
| F02  | [Lint, format, hooks](foundation/02-lint-format-hooks.md)             |
| F03  | [GitHub template và CI](foundation/03-github-ci.md)                   |
| F04  | [Env và nền tảng test](foundation/04-test-env-foundation.md)          |
| F05  | [Session, HttpClient, Runtime](foundation/05-session-http-runtime.md) |
| F06  | [Lỗi, toast, dialog](foundation/06-errors-toast-dialog.md)            |
| F07  | [CSS, design system, theme](foundation/07-css-design-system.md)       |
| F08  | [i18n](foundation/08-i18n.md)                                         |
| F09  | [Khung features/auth và StoreScope](foundation/09-auth-skeleton.md)   |
| F10  | [E2E và coverage](foundation/10-e2e-coverage.md)                      |
| F11  | [Chặn index và PWA](foundation/11-pwa-noindex.md)                     |
| F12  | [Navigation và tool dev](foundation/12-navigation-devtools.md)        |
| F13  | [Script sinh API types](foundation/13-gen-api-types.md)               |
| F14  | [Đối chiếu và chốt](foundation/14-reconcile-finalize.md)              |

## Hồ sơ Pages

| Bước | Nội dung                                                                |
| ---- | ----------------------------------------------------------------------- |
| P01  | [Hoàn thiện Layout](screens/01-layout-completion.md)                    |
| P02  | [Dashboard](screens/02-dashboard.md)                                    |
| P03  | [Nền tảng List & Table](screens/03-list-table-foundation.md)            |
| P04  | [Nền tảng Form & Media](screens/04-form-media-foundation.md)            |
| P05  | [Products — List](screens/05-products-list.md)                          |
| P06  | [Categories](screens/06-categories.md)                                  |
| P07  | [Products — Create / Edit / Detail](screens/07-products-form-detail.md) |
| P08  | [Orders](screens/08-orders.md)                                          |
| P09  | [Customers](screens/09-customers.md)                                    |
| P10  | [Inventory](screens/10-inventory.md)                                    |
| P11  | [Promotions](screens/11-promotions.md)                                  |
| P12  | [Users & Roles](screens/12-users-roles.md)                              |
| P13  | [Settings](screens/13-settings.md)                                      |
| P14  | [Đối chiếu và chốt](screens/14-reconcile-finalize.md)                   |

## Tham chiếu kỹ thuật của Foundation

Các chương dưới giữ bối cảnh scaffold, không phải guide hiện hành.

- [Quyết định đã chốt](reference/decisions.md)
- [Thuật ngữ](../../../GLOSSARY.md)
- [A. Cây thư mục đầy đủ](reference/project-tree.md)
- [A. Cây thư mục đầy đủ — phần 2](reference/project-tree-02.md)
- [B. Quy tắc đặt tên](reference/naming.md)
- [Git và hooks — lịch sử scaffold](reference/git.md)
- [E. ESLint rules](reference/lint.md)
- [E. ESLint rules — phần 2](reference/lint-02.md)
- [F. Template](reference/templates.md)
- [G. Tooling](reference/tooling.md)
- [H. Cấu hình i18n (vue-i18n)](reference/localization.md)
- [I. Cấu hình unit / component test (Vitest)](reference/testing.md)
- [J. Cấu hình CSS (Tailwind v4 + Nuxt UI)](reference/styling.md)
- [K. Danh sách package](reference/dependencies.md)
- [L. Design system (token CSS)](reference/design-tokens.md)
- [L. Design system (token CSS) — phần 2](reference/design-tokens-02.md)
- [M. HTTP client, seam với auth và StoreScope](reference/http-session.md)
- [M. HTTP client, seam với auth và StoreScope — phần 2](reference/http-session-02.md)
- [N. Import alias](reference/aliases.md)
- [O. Lỗi API, mã lỗi, xử lý trong HttpClient](reference/errors.md)
- [O. Lỗi API, mã lỗi, xử lý trong HttpClient — phần 2](reference/errors-02.md)
- [P. Dialog, toast: global hay internal](reference/feedback.md)
- [Q. Cấu trúc từng module](reference/features.md)
- [Q. Cấu trúc từng module — phần 2](reference/features-02.md)
- [Q. Cấu trúc từng module — phần 3](reference/features-03.md)
- [R. PWA, chặn index](reference/pwa.md)
- [S. Tính năng & tool bổ trợ cho CMS](reference/app-capabilities.md)
- [Luồng dữ liệu và SOLID — lịch sử scaffold](reference/data-flow.md)
- [V. Lý do các quyết định D25, D34, D37–D41](reference/decision-rationale.md)
- [Các bước scaffold nền tảng](reference/delivery-foundation.md)
- [Các bước app, kiểm tra và bàn giao](reference/delivery-app.md)
