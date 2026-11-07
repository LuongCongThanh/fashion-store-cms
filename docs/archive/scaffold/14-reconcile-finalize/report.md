# 14 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `docs/reconcile-finalize` (stacked trên `chore/gen-api-types`)
Ngày hoàn thành: 2026-11-07

## Đã làm

- **So cây thư mục với §A** bằng script: lấy mọi tên file trong cây §A rồi so với `git ls-files`.
  - Thiếu và đã tạo: `layouts/components/AppHeader.vue` (tách header ra khỏi `DashboardLayout`) và `shared/components/page/PageHeader.vue` (gắn sẵn `font-display`, dùng ở `LoginView` và `DesignSystemView`).
  - Thiếu nhưng cố ý hoãn: `StoreScope.api.ts`, sẽ làm ở P3 khi có API Store. Các file khác trong danh sách thiếu đều nằm trong thư mục cha đã đánh dấu `(P5)` hoặc `(P10)`.
  - Có trong repo nhưng chưa có trong §A: `.env.development`, `.env.production`, `knip.json`. Đã bổ sung vào cây §A trong `CONVENTIONS.md`, kèm `Env.config.spec.ts` và các mục `docs/archive`, `docs/plan`.
- **`docs/CONVENTIONS.md`**, viết cho dev trong team:
  - Gồm §A và §B–§U, giữ nguyên ký hiệu mục để link "§X" cũ vẫn dùng được.
  - 33 code block mẫu đã có file thật được thay bằng link tới file nguồn, để tài liệu không lệch dần so với code.
  - Phần mô tả được cập nhật theo những chỗ đã làm khác plan ở plan 01–13: regex cho ranh giới feature, `useT()`, `tsconfigPaths({ loose: true })`, TS `~5.9`, `ui({ components: false, colorMode: false })`, `createNotifier({ toast, t, te })` và `prompt`, `enableAutoUnmount`, `pwaAssets.integration`, interface ở §Q.3.
  - Bỏ các ghi chú lịch sử (cột "Step x", "chuyển từ K.2 lên"...).
- **Lưu trữ**: chuyển `docs/plan/scaffold-plan.md` sang `docs/archive/scaffold-plan.md` bằng `git mv`, giữ nguyên bảng D1–D41 và §V.
- **Sửa link**:
  - 44 link trong `docs/plan/` trỏ sang `archive/`.
  - `FE_architecture.md`: link §X đổi sang `CONVENTIONS.md`; mã D-số dẫn qua `CONVENTIONS.md`, vì chỉ file này mới link tới archive.
  - Sửa thêm link GLOSSARY hỏng sẵn trong plan 09.
- `README.md`: thêm cách chạy, bảng các lệnh npm, và link tới tài liệu.
- CI: thêm job `knip` với `continue-on-error`, không chặn merge (§S.2).
- `knip.json`: bỏ `openapi-typescript` khỏi `ignoreDependencies`, vì gói này đã được dùng.

## Kết quả kiểm tra

| Mục kiểm tra                                                      | Kết quả | Ghi chú                                                                                   |
| ----------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| Cây thư mục thực tế khớp §A                                       | Pass    | Ngoại trừ `StoreScope.api.ts` hoãn tới P3; đã ghi chú ở trên                              |
| `npm run lint` toàn repo                                          | Pass    |                                                                                           |
| `docs/CONVENTIONS.md` có §B–§U                                    | Pass    | Có thêm §A                                                                                |
| Plan đã chuyển sang `docs/archive/`                               | Pass    |                                                                                           |
| `grep -n 'scaffold-plan' docs/FE_architecture.md README.md` = 0   | Pass    | 0 kết quả                                                                                 |
| `grep -rn '\.\./scaffold-plan.md\|\./scaffold-plan.md' docs/plan` | Pass    | Còn đúng 2 dòng, đều là đoạn văn mô tả trong plan 14 (trích tên link cũ), không phải link |
| Không có link markdown hỏng trong `docs/` và `*.md`               | Pass    | Kiểm bằng script                                                                          |
| lint, format, typecheck, test, coverage, e2e, build               | Pass    | 120/120, e2e 2/2, coverage khoảng 70% (chưa đặt ngưỡng)                                   |

## Lệch so với plan / quyết định mới

- `CONVENTIONS.md` có thêm §A, vì `FE_architecture.md` link tới §A. Nếu không đưa §A vào, link đó phải trỏ vào archive và tiêu chí grep sẽ không đạt.
- Mã D-số trong `FE_architecture.md` dẫn qua `CONVENTIONS.md`, không link thẳng tới archive. Lý do: plan yêu cầu link lý do quyết định tới `docs/archive/scaffold-plan.md`, nhưng tiêu chí grep lại cấm chuỗi `scaffold-plan` trong file này; hai yêu cầu mâu thuẫn nhau.
- Coverage giảm từ khoảng 77% xuống 70%, vì đã thêm component layout chưa có test (AppSidebar, AppHeader, PageHeader…). Các component này không nằm trong danh sách seam đã chốt.

## Việc còn tồn (toàn bộ scaffold)

- **Việc tay trên GitHub**: bật bảo vệ `main` theo §C.4.
- **Hạ tầng (DevOps)**: header `X-Robots-Tag: noindex, nofollow`; proxy `/api`, hoặc đặt `VITE_API_BASE_URL` khi build.
- **Chờ BE**: Swagger (`gen:api`); response của `/auth/login`, `/auth/me`, `/auth/refresh`; xác nhận header `X-Store-Id`.
- Thêm job e2e vào CI khi có login thật (P2). Nâng `actions/*` lên v5 (cảnh báo Node 20).
- Điền token usage (`token-usage.md`) cho các plan 01–14.
- Đổi `Status:` sang `done` sau khi từng PR được merge.

## Lệch spec đã chấp nhận (review PR #2–#15)

Những hành vi dưới đây nằm ngoài chữ của spec nhưng được giữ lại có chủ đích:

| Plan    | Hành vi                                                                                | Lý do giữ                                                                                                    |
| ------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 03      | CI có thêm `format:check`, job `knip` (không chặn merge), job `e2e` và `test:coverage` | Bắt lỗi format/code thừa sớm; e2e đã có flow thật (redirect khi chưa đăng nhập).                             |
| 05      | `authFailure` vừa điều hướng về `auth.login` vừa hiện toast "Session expired"          | Người dùng cần biết vì sao bị đẩy ra màn đăng nhập.                                                          |
| 05      | `/auth/login` gửi với `skipAuth`                                                       | 401 khi login là sai thông tin, không được kích hoạt refresh/`authFailure`.                                  |
| 06      | `ErrorHandling` tải lại trang một lần khi lỗi tải chunk                                | Deploy mới xoá chunk cũ; cờ `sessionStorage` chặn vòng lặp.                                                  |
| 07      | `localStorage` có thêm `cms.locale`, `cms.sidebarCollapsed` và key session             | Tiêu chí "chỉ có `cms.colorMode`" viết trước khi có i18n, sidebar, session; mọi key vẫn dùng tiền tố `cms.`. |
| 09 / 12 | `Guards.ts` đọc thêm `meta.permission`, gọi `ensureUser()`, có route `forbidden`       | Guard quyền cần user đã nạp; ngoại lệ §V.3 mở rộng thành `requiresAuth` + `permission`.                      |
