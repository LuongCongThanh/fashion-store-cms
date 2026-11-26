# Nền tảng CMS — phạm vi lịch sử

Status: done
Nguồn chuẩn chi tiết: [scaffold-plan.md](README.md)

## Lưu ý bắt buộc

- **Không commit hoặc mở PR dưới tên Claude.** Không thêm dòng `Co-Authored-By: Claude …`, không ghi "Generated with Claude Code", không đặt author/committer là Claude. Commit dùng git user của người làm và đặt tên theo Conventional Commits (§C.2).
- Chỉ commit hoặc push khi người phụ trách đồng ý.
- Mỗi plan con dùng một nhánh và một PR riêng, squash merge vào `main` (D27).
- Làm tuần tự: xong một plan thì dừng lại báo kết quả trong `report.md`, được xác nhận mới làm plan tiếp theo.

## Vấn đề

Repo mới chỉ có tài liệu. Cần dựng khung dự án Vue 3 + Vite + TypeScript (Foundation) với lint, test, HTTP client, xử lý lỗi, design system, i18n, khung auth và PWA để các Phase nghiệp vụ sau có thể xây trực tiếp lên. Plan gốc dài 2346 dòng, khó review trong một lần, nên được chia thành 14 plan con.

## Giải pháp

Mỗi hồ sơ nền tảng nằm ở `foundation/NN-<slug>.md`, gồm đặc tả/kế hoạch và kết quả/review. Số thứ tự là thứ tự thực hiện. Mỗi hồ sơ có hai phần:

| File               | Vai trò                                                                    |
| ------------------ | -------------------------------------------------------------------------- |
| Đặc tả và kế hoạch | Mục tiêu, phạm vi, tiêu chí, phụ thuộc và cách thực hiện của bước.         |
| Kết quả và review  | Kết quả đã ghi, lệch kế hoạch, giới hạn và việc còn tồn của chính bước đó. |

Số token của mọi plan ghi chung trong [token-usage.md](metrics/foundation.md).

Giá trị của `Status`: `ready-for-agent` → `in-progress` → `done`.

## Quy trình thực hiện mỗi plan

1. Kiểm tra mọi plan trong `Blocked by` đã `Status: done`.
2. Tạo nhánh riêng từ `main` (D27), ví dụ `chore/<slug>`.
3. Đổi `Status:` trong `spec.md` (phần Kế hoạch thực hiện) thành `in-progress`.
4. Làm theo mục **Làm gì** trong `spec.md` (phần Kế hoạch thực hiện); tra phần tham chiếu ngay trong file đó.
5. Chạy hết mục **Kiểm tra**, ghi kết quả vào `report.md`.
6. Ghi token đã dùng vào [token-usage.md](metrics/foundation.md).
7. Commit theo Conventional Commits (§C.2), tuân thủ [Lưu ý bắt buộc](#lưu-ý-bắt-buộc).
8. Mở PR, squash merge sau khi được duyệt; đổi `Status:` thành `done`.

## Danh sách plan con

| #   | Plan                                                                                     | Nguồn            | Blocked by     |
| --- | ---------------------------------------------------------------------------------------- | ---------------- | -------------- |
| 01  | [Khởi tạo dự án](foundation/01-init-project.md#kế-hoạch-thực-hiện)                       | Step 1           | —              |
| 02  | [Lint, format, hooks](foundation/02-lint-format-hooks.md#kế-hoạch-thực-hiện)             | Step 2           | 01             |
| 03  | [GitHub template và CI](foundation/03-github-ci.md#kế-hoạch-thực-hiện)                   | Step 2b          | 02             |
| 04  | [Env và nền tảng test](foundation/04-test-env-foundation.md#kế-hoạch-thực-hiện)          | Step 3a (phần 1) | 02             |
| 05  | [Session, HttpClient, Runtime](foundation/05-session-http-runtime.md#kế-hoạch-thực-hiện) | Step 3a (phần 2) | 04             |
| 06  | [Lỗi, toast, dialog](foundation/06-errors-toast-dialog.md#kế-hoạch-thực-hiện)            | Step 3a+         | 05             |
| 07  | [CSS, design system, theme](foundation/07-css-design-system.md#kế-hoạch-thực-hiện)       | Step 3b          | 05             |
| 08  | [i18n](foundation/08-i18n.md#kế-hoạch-thực-hiện)                                         | Step 3c          | 05             |
| 09  | [Khung features/auth và StoreScope](foundation/09-auth-skeleton.md#kế-hoạch-thực-hiện)   | Step 4           | 06, 07, 08     |
| 10  | [E2E và coverage](foundation/10-e2e-coverage.md#kế-hoạch-thực-hiện)                      | Step 5           | 09             |
| 11  | [Chặn index và PWA](foundation/11-pwa-noindex.md#kế-hoạch-thực-hiện)                     | Step 5b (phần 1) | 09             |
| 12  | [Navigation và tool dev](foundation/12-navigation-devtools.md#kế-hoạch-thực-hiện)        | Step 5b (phần 2) | 09             |
| 13  | [Script sinh API types](foundation/13-gen-api-types.md#kế-hoạch-thực-hiện)               | Step 6           | 05             |
| 14  | [Đối chiếu và chốt](foundation/14-reconcile-finalize.md#kế-hoạch-thực-hiện)              | Step 7           | 10, 11, 12, 13 |

Step 3a, 5b được tách đôi (phần 1/2) chỉ trong danh sách này, không có heading riêng trong scaffold-plan. Step 0 (chốt tài liệu) đã xong trong PR #1 nên không có plan con.

## Tiêu chí hoàn thành

- Cả 14 plan có `Status: done`, và `report.md` của từng plan ghi kết quả pass cho mọi mục kiểm tra.
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:coverage`, `npm run test:e2e` và `npm run build` đều pass; CI xanh.
- Cây thư mục thực tế khớp với §A; các convention đã được chuyển sang `docs/guides/README.md` (plan 14).
- [token-usage.md](metrics/foundation.md) có đủ số token của 14 plan.
- Không có commit nào trên `main` mang tên hoặc attribution của Claude.

## Ngoài phạm vi

Xem mục "Ngoài phạm vi plan này" trong [scaffold-plan.md](README.md): feature nghiệp vụ, gọi API thật, generator, Storybook, theme theo Store, 3D.

Cấu trúc lưu trữ hiện tại: đặc tả/kế hoạch và kết quả/review cùng một file, có heading tách riêng để giữ nguồn và trạng thái. Trạng thái và quy trình bên trên là lịch sử, không phải workflow repo hiện hành.

## Bối cảnh khi lập scaffold

Bản scaffold đã đóng, được chia theo chủ đề để tra quyết định D1–D41 và lý do. Quy ước hiện hành nằm trong [CONVENTIONS](../../guides/README.md).

Mục tiêu: dựng khung dự án (Foundation) theo [FE_architecture.md](../../architecture/README.md), **chưa** làm logic nghiệp vụ.

Nguyên tắc thực hiện:

- Làm tuần tự từng step; xong mỗi step dừng lại báo kết quả, được xác nhận mới sang step tiếp.
- Không tạo thư mục rỗng — mỗi file có nội dung tối thiểu (§5).
- Package manager: npm. Node 22 LTS.
- Ký hiệu tham chiếu: `§` + chữ (§A–§V) và `Step N` là mục trong tài liệu này; `§` + số (VD §5, §21, §30) là mục trong `FE_architecture.md`.
- Trong lúc scaffold, tài liệu này là nguồn chuẩn cho convention; khi lệch với `FE_architecture.md` thì sửa `FE_architecture.md` theo tài liệu này (Step 0).
- Plan là tài liệu **tạm**: ở Step 7, các convention bền vững (§B–§U) được chuyển sang `docs/guides/README.md`, rồi plan chuyển vào `docs/archive/`. Sau đó chỉ còn một nguồn chuẩn cho mỗi chủ đề.
