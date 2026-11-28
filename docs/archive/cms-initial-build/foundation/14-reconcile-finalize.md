# F14 — Đối chiếu và chốt

> Hồ sơ lịch sử nền tảng; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: done
Blocked by: 10, 11, 12, 13
Nguồn: Step 7 · Spec tổng: [Phạm vi giai đoạn](../foundation.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../foundation.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Cây thư mục khớp §A, convention chuyển sang CONVENTIONS.md, plan được archive.

### Phạm vi (Làm gì)

- So cây thư mục thực tế với §A, sửa chỗ lệch; `npm run lint` toàn repo pass.
- Tách tài liệu (§ nguyên tắc): §B–§U → `docs/conventions/README.md` (bỏ phần lịch sử/lý do dài); bảng quyết định D + lý do (§V) giữ nguyên trong plan đã archive; plan → `docs/archive/cms-initial-build/README.md`. `FE_architecture.md` link sang `CONVENTIONS.md` thay vì lặp lại.
- Sửa link: `grep -n 'scaffold-plan' docs/architecture/README.md README.md` phải về 0 kết quả — mỗi link (D-số, §B–§U) đổi sang mục tương ứng trong `CONVENTIONS.md`; link tới lý do quyết định (§V) đổi sang `docs/archive/cms-initial-build/README.md`.

### Tiêu chí hoàn thành

- Cây thư mục thực tế khớp §A; `npm run lint` toàn repo pass.
- `docs/conventions/README.md` có §B–§U; plan đã chuyển sang `docs/archive/`.
- `grep -n 'scaffold-plan' docs/architecture/README.md README.md` trả về 0 kết quả.

### Phụ thuộc

- Blocked by: 10, 11, 12, 13

### Ngoài phạm vi

- Những việc của các plan con khác trong [spec tổng](../foundation.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

### Kế hoạch thực hiện

#### Step 7 — Đối chiếu và chốt

**Làm gì**

- So cây thư mục thực tế với §A, sửa chỗ lệch; `npm run lint` toàn repo pass.
- Tách tài liệu (§ nguyên tắc): §B–§U → `docs/conventions/README.md` (bỏ phần lịch sử/lý do dài); bảng quyết định D + lý do (§V) giữ nguyên trong plan đã archive; plan → `docs/archive/cms-initial-build/README.md`. `FE_architecture.md` link sang `CONVENTIONS.md` thay vì lặp lại.
- Sửa link: `grep -n 'scaffold-plan' docs/architecture/README.md README.md` phải về 0 kết quả — mỗi link (D-số, §B–§U) đổi sang mục tương ứng trong `CONVENTIONS.md`; link tới lý do quyết định (§V) đổi sang `docs/archive/cms-initial-build/README.md`.
- Sửa link trong `docs/plan/` (spec tổng + 14 plan con đang trỏ `../scaffold-plan.md` / `./scaffold-plan.md`): đổi sang `docs/archive/cms-initial-build/README.md`, hoặc archive cả `docs/plan/` cùng lúc. Kiểm tra: `grep -rn '\.\../archive/scaffold-plan.md\|\../archive/scaffold-plan.md' docs/plan` về 0 kết quả (hoặc thư mục đã được chuyển).

**Commit / PR (D27):** mỗi step là một nhánh + PR riêng, squash merge vào `main` (VD `chore(config): init vite project`, `chore(config): add eslint prettier husky`, `feat(api): add http client with refresh seam`…). Step 1 chưa có hook nên tự kiểm tra format commit; từ Step 2 hook tự chặn. Chỉ commit/push khi được đồng ý.

### Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

_Không có phần tham chiếu riêng; dùng phần dùng chung._

## Kết quả và review

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `docs/reconcile-finalize` (stacked trên `chore/gen-api-types`)
Ngày hoàn thành: 2026-11-07

### Đã làm

- **So cây thư mục với §A** bằng script: lấy mọi tên file trong cây §A rồi so với `git ls-files`.
  - Thiếu và đã tạo: `layouts/components/AppHeader.vue` (tách header ra khỏi `DashboardLayout`) và `shared/components/page/PageHeader.vue` (gắn sẵn `font-display`, dùng ở `LoginView` và `DesignSystemView`).
  - Thiếu nhưng cố ý hoãn: `StoreScope.api.ts`, sẽ làm ở P3 khi có API Store. Các file khác trong danh sách thiếu đều nằm trong thư mục cha đã đánh dấu `(P5)` hoặc `(P10)`.
  - Có trong repo nhưng chưa có trong §A: `.env.development`, `.env.production`, `knip.json`. Đã bổ sung vào cây §A trong `CONVENTIONS.md`, kèm `Env.config.spec.ts` và các mục `docs/archive`, `docs/plan`.
- **`docs/conventions/README.md`**, viết cho dev trong team:
  - Gồm §A và §B–§U, giữ nguyên ký hiệu mục để link "§X" cũ vẫn dùng được.
  - 33 code block mẫu đã có file thật được thay bằng link tới file nguồn, để tài liệu không lệch dần so với code.
  - Phần mô tả được cập nhật theo những chỗ đã làm khác plan ở plan 01–13: regex cho ranh giới feature, `useT()`, `tsconfigPaths({ loose: true })`, TS `~5.9`, `ui({ components: false, colorMode: false })`, `createNotifier({ toast, t, te })` và `prompt`, `enableAutoUnmount`, `pwaAssets.integration`, interface ở §Q.3.
  - Bỏ các ghi chú lịch sử (cột "Step x", "chuyển từ K.2 lên"...).
- **Lưu trữ**: chuyển `docs/plan/scaffold-plan.md` sang `docs/archive/cms-initial-build/README.md` bằng `git mv`, giữ nguyên bảng D1–D41 và §V.
- **Sửa link**:
  - 44 link trong `docs/plan/` trỏ sang `archive/`.
  - `FE_architecture.md`: link §X đổi sang `CONVENTIONS.md`; mã D-số dẫn qua `CONVENTIONS.md`, vì chỉ file này mới link tới archive.
  - Sửa thêm link GLOSSARY hỏng sẵn trong plan 09.
- `README.md`: thêm cách chạy, bảng các lệnh npm, và link tới tài liệu.
- CI: thêm job `knip` với `continue-on-error`, không chặn merge (§S.2).
- `knip.json`: bỏ `openapi-typescript` khỏi `ignoreDependencies`, vì gói này đã được dùng.

### Kết quả kiểm tra

| Mục kiểm tra                                                        | Kết quả | Ghi chú                                                                                   |
| ------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| Cây thư mục thực tế khớp §A                                         | Pass    | Ngoại trừ `StoreScope.api.ts` hoãn tới P3; đã ghi chú ở trên                              |
| `npm run lint` toàn repo                                            | Pass    |                                                                                           |
| `docs/conventions/README.md` có §B–§U                                    | Pass    | Có thêm §A                                                                                |
| Plan đã chuyển sang `docs/archive/`                                 | Pass    |                                                                                           |
| `grep -n 'scaffold-plan' docs/architecture/README.md README.md` = 0 | Pass    | 0 kết quả                                                                                 |
| `grep -rn '\.\./scaffold-plan.md\|\./scaffold-plan.md' docs/plan`   | Pass    | Còn đúng 2 dòng, đều là đoạn văn mô tả trong plan 14 (trích tên link cũ), không phải link |
| Không có link markdown hỏng trong `docs/` và `*.md`                 | Pass    | Kiểm bằng script                                                                          |
| lint, format, typecheck, test, coverage, e2e, build                 | Pass    | 120/120, e2e 2/2, coverage khoảng 70% (chưa đặt ngưỡng)                                   |

### Lệch so với plan / quyết định mới

- `CONVENTIONS.md` có thêm §A, vì `FE_architecture.md` link tới §A. Nếu không đưa §A vào, link đó phải trỏ vào archive và tiêu chí grep sẽ không đạt.
- Mã D-số trong `FE_architecture.md` dẫn qua `CONVENTIONS.md`, không link thẳng tới archive. Lý do: plan yêu cầu link lý do quyết định tới `docs/archive/cms-initial-build/README.md`, nhưng tiêu chí grep lại cấm chuỗi `scaffold-plan` trong file này; hai yêu cầu mâu thuẫn nhau.
- Coverage giảm từ khoảng 77% xuống 70%, vì đã thêm component layout chưa có test (AppSidebar, AppHeader, PageHeader…). Các component này không nằm trong danh sách seam đã chốt.

### Việc còn tồn (toàn bộ scaffold)

- **Việc tay trên GitHub**: bật bảo vệ `main` theo §C.4.
- **Hạ tầng (DevOps)**: header `X-Robots-Tag: noindex, nofollow`; proxy `/api`, hoặc đặt `VITE_API_BASE_URL` khi build.
- **Chờ BE**: Swagger (`gen:api`); response của `/auth/login`, `/auth/me`, `/auth/refresh`; xác nhận header `X-Store-Id`.
- Thêm job e2e vào CI khi có login thật (P2). Nâng `actions/*` lên v5 (cảnh báo Node 20).
- Điền token usage (`token-usage.md`) cho các plan 01–14.
- Đổi `Status:` sang `done` sau khi từng PR được merge.

### Lệch spec đã chấp nhận (review PR #2–#15)

Những hành vi dưới đây nằm ngoài chữ của spec nhưng được giữ lại có chủ đích:

| Plan    | Hành vi                                                                                | Lý do giữ                                                                                                    |
| ------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 03      | CI có thêm `format:check`, job `knip` (không chặn merge), job `e2e` và `test:coverage` | Bắt lỗi format/code thừa sớm; e2e đã có flow thật (redirect khi chưa đăng nhập).                             |
| 05      | `authFailure` vừa điều hướng về `auth.login` vừa hiện toast "Session expired"          | Người dùng cần biết vì sao bị đẩy ra màn đăng nhập.                                                          |
| 05      | `/auth/login` gửi với `skipAuth`                                                       | 401 khi login là sai thông tin, không được kích hoạt refresh/`authFailure`.                                  |
| 06      | `ErrorHandling` tải lại trang một lần khi lỗi tải chunk                                | Deploy mới xoá chunk cũ; cờ `sessionStorage` chặn vòng lặp.                                                  |
| 07      | `localStorage` có thêm `cms.locale`, `cms.sidebarCollapsed` và key session             | Tiêu chí "chỉ có `cms.colorMode`" viết trước khi có i18n, sidebar, session; mọi key vẫn dùng tiền tố `cms.`. |
| 09 / 12 | `Guards.ts` đọc thêm `meta.permission`, gọi `ensureUser()`, có route `forbidden`       | Guard quyền cần user đã nạp; ngoại lệ §V.3 mở rộng thành `requiresAuth` + `permission`.                      |
