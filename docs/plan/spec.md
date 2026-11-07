# Spec — Scaffold Foundation cho Fashion Store CMS

Status: ready-for-agent
Nguồn chuẩn chi tiết: [scaffold-plan.md](./scaffold-plan.md)

## Lưu ý bắt buộc

- **Không commit hoặc mở PR dưới tên Claude.** Không thêm dòng `Co-Authored-By: Claude …`, không ghi "Generated with Claude Code", không đặt author/committer là Claude. Commit dùng git user của người làm và đặt tên theo Conventional Commits (§C.2).
- Chỉ commit hoặc push khi người phụ trách đồng ý.
- Mỗi plan con dùng một nhánh và một PR riêng, squash merge vào `main` (D27).
- Làm tuần tự: xong một plan thì dừng lại báo kết quả trong `report.md`, được xác nhận mới làm plan tiếp theo.

## Vấn đề

Repo mới chỉ có tài liệu. Cần dựng khung dự án Vue 3 + Vite + TypeScript (Foundation) với lint, test, HTTP client, xử lý lỗi, design system, i18n, khung auth và PWA để các Phase nghiệp vụ sau có thể xây trực tiếp lên. Plan gốc dài 2346 dòng, khó review trong một lần, nên được chia thành 14 plan con.

## Giải pháp

Mỗi plan con nằm trong `docs/plan/NN-<slug>/`. Số thứ tự là thứ tự thực hiện. Mỗi folder gồm:

| File | Vai trò |
| --- | --- |
| `spec.md` | Spec riêng của plan con: mục tiêu, phạm vi, tiêu chí hoàn thành, phụ thuộc. Mỗi mục có chú thích giải thích. |
| `plan.md` | Việc cần làm, tiêu chí kiểm tra, và các phần tham chiếu chép nguyên văn từ plan gốc. Có dòng `Status:` và `Blocked by:` ở đầu. |
| `guide.md` | Các bước thực hiện plan, từ tạo nhánh đến merge. |
| `report.md` | Ghi kết quả sau khi làm: đã làm gì, kết quả kiểm tra, chỗ lệch so với plan, việc còn tồn. |
| `metric.md` | Ghi số token đã tốn cho mỗi phiên làm việc. |

Giá trị của `Status`: `ready-for-agent` → `in-progress` → `done`.

## Danh sách plan con

| # | Plan | Nguồn | Blocked by |
| --- | --- | --- | --- |
| 01 | [Khởi tạo dự án](./01-init-project/plan.md) | Step 1 | — |
| 02 | [Lint, format, hooks](./02-lint-format-hooks/plan.md) | Step 2 | 01 |
| 03 | [GitHub template và CI](./03-github-ci/plan.md) | Step 2b | 02 |
| 04 | [Env và nền tảng test](./04-test-env-foundation/plan.md) | Step 3a (phần 1) | 02 |
| 05 | [Session, HttpClient, Runtime](./05-session-http-runtime/plan.md) | Step 3a (phần 2) | 04 |
| 06 | [Lỗi, toast, dialog](./06-errors-toast-dialog/plan.md) | Step 3a+ | 05 |
| 07 | [CSS, design system, theme](./07-css-design-system/plan.md) | Step 3b | 05 |
| 08 | [i18n](./08-i18n/plan.md) | Step 3c | 05 |
| 09 | [Khung features/auth và StoreScope](./09-auth-skeleton/plan.md) | Step 4 | 06, 07, 08 |
| 10 | [E2E và coverage](./10-e2e-coverage/plan.md) | Step 5 | 09 |
| 11 | [Chặn index và PWA](./11-pwa-noindex/plan.md) | Step 5b (phần 1) | 09 |
| 12 | [Navigation và tool dev](./12-navigation-devtools/plan.md) | Step 5b (phần 2) | 09 |
| 13 | [Script sinh API types](./13-gen-api-types/plan.md) | Step 6 | 05 |
| 14 | [Đối chiếu và chốt](./14-reconcile-finalize/plan.md) | Step 7 | 10, 11, 12, 13 |

Step 0 (chốt tài liệu) đã xong trong PR #1 nên không có plan con.

## Tiêu chí hoàn thành

- Cả 14 plan có `Status: done`, và `report.md` của từng plan ghi kết quả pass cho mọi mục kiểm tra.
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:coverage`, `npm run test:e2e` và `npm run build` đều pass; CI xanh.
- Cây thư mục thực tế khớp với §A; các convention đã được chuyển sang `docs/CONVENTIONS.md` (plan 14).
- [metric.md](./metric.md) tổng có đủ số token của 14 plan.
- Không có commit nào trên `main` mang tên hoặc attribution của Claude.

## Ngoài phạm vi

Xem mục "Ngoài phạm vi plan này" trong [scaffold-plan.md](./scaffold-plan.md): feature nghiệp vụ, gọi API thật, generator, Storybook, theme theo Store, 3D.
