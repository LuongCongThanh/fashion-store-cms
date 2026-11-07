# 03 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `ci/github-ci` / #4 (stacked trên #3)
Ngày hoàn thành: 2026-11-07

## Đã làm

- `.github/pull_request_template.md` theo §F.1.
- `.github/ISSUE_TEMPLATE/bug_report.md` và `feature_request.md`.
- `.github/workflows/ci.yml` có 4 job tên `lint` (kèm `format:check`), `typecheck`, `test`, `build`, khớp tên status check ở §C.4. Mỗi job chạy `npm ci`, Node lấy theo `.nvmrc`. CI chạy trên mọi PR (kể cả PR stacked) và khi push vào `main`.

## Kết quả kiểm tra

| Mục kiểm tra        | Kết quả | Ghi chú                                                |
| ------------------- | ------- | ------------------------------------------------------ |
| Mở PR thấy template | Pass    | Nội dung PR #4 được tạo từ template                    |
| CI chạy xanh        | Pass    | Run 42353275670: build, lint, test, typecheck đều pass |

## Lệch so với plan / quyết định mới

- Job `lint` chạy thêm `format:check`.

## Việc còn tồn

- ~~**Bảo vệ `main` (§C.4) phải bật tay trên GitHub**~~ — **Đã bật 2026-11-07** (repo chuyển sang public vì gói Free không hỗ trợ branch protection cho repo private; admin được bypass): Require PR + 1 approval, dismiss stale approvals; status checks `lint`, `typecheck`, `test`, `build`; linear history; chỉ cho squash merge; tự xoá nhánh sau khi merge.
- GitHub cảnh báo `actions/checkout@v4` và `setup-node@v4` đang chạy trên Node 20 (deprecated). Nên nâng lên v5 trong một PR riêng. — **Đã nâng lên v7 ở PR #19.**
- Token usage: chưa điền.
