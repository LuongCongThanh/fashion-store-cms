# Git, commit và pull request

> Policy hiện hành cho source chưa migrate; xem [ADR](docs/adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## Git

## Nhánh

Hai nhánh dài hạn:

| Nhánh  | Vai trò                                                                    |
| ------ | -------------------------------------------------------------------------- |
| `main` | Bản đã phát hành. Chỉ nhận PR release từ `dev`. Release bằng tag `vX.Y.Z`. |
| `dev`  | Nhánh tích hợp. Mọi nhánh tính năng tách từ đây và merge về đây.           |

```text
main ──────────────●──────────────●──── (tag v0.1.0, v0.2.0…)
                  ╱              ╱
dev ──●──●──●──●─┴──●──●──●──●──┴──
       ╲  ╱  ╲  ╱
        feature/…  fix/…
```

- Nhánh tính năng tách từ `dev`, sống ngắn (≤ 3 ngày), merge lại `dev` qua PR.
- Release: mở PR `dev → main` (tiêu đề `chore(release): vX.Y.Z`), merge xong gắn tag trên `main`. PR release được miễn kiểm body (`pr-body.yml`).
- `hotfix/` tách từ `main`, merge vào `main`, rồi merge `main` ngược về `dev` để hai nhánh không lệch.
- Tên nhánh: `<type>/<TICKET>-<mo-ta-ngan>` (kebab-case, không dấu). Không có ticket thì bỏ phần `<TICKET>-`.

| type        | Dùng khi                        |
| ----------- | ------------------------------- |
| `feature/`  | Tính năng mới                   |
| `fix/`      | Sửa lỗi                         |
| `hotfix/`   | Sửa lỗi khẩn trên production    |
| `refactor/` | Đổi cấu trúc, không đổi hành vi |
| `chore/`    | Tooling, dependency, config     |
| `docs/`     | Tài liệu                        |
| `test/`     | Chỉ thêm/sửa test               |

Ví dụ: `feature/CMS-123-product-list`, `fix/CMS-210-refresh-token-loop`.

## Commit message — Conventional Commits

```text
<type>(<scope>): <subject>

[body — vì sao thay đổi]

[footer — Refs: CMS-123 | BREAKING CHANGE: ...]
```

- `type`: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`, `revert`.
- `scope`: tên feature hoặc khu vực — `auth`, `products`, `orders`, `router`, `api`, `ui`, `deps`, `config`… (danh sách cấu hình trong `commitlint.config.ts`, sai scope thì báo lỗi).
- `subject`: tiếng Anh, thể mệnh lệnh, chữ thường đầu câu, không dấu chấm cuối, header ≤ 72 ký tự.
- Breaking change: `feat(api)!: ...` + footer `BREAKING CHANGE:`.
- Mỗi commit một ý; không commit code lỗi build.

Ví dụ: `feat(products): add server-side pagination to product table`.

## Pull Request

- Tiêu đề PR theo format commit (vì squash merge dùng tiêu đề PR làm commit message).
- ≤ ~400 dòng thay đổi (không tính file generated / lock); lớn hơn thì tách.
- Bắt buộc: CI xanh + ≥ 1 approve; resolve hết conversation.
- PR vào `dev`: **squash merge**; xoá nhánh sau khi merge.
- PR release `dev → main`: **merge commit** (không squash) để lịch sử của `dev` có trong `main`. Nếu squash thì `dev` và `main` lệch nhau sau mỗi lần release.
- Nhánh tính năng bị lệch thì rebase lên `dev`, không merge `dev` vào nhánh.

## Bảo vệ `main` và `dev` (làm tay trên GitHub)

- Cả hai nhánh: require PR, 1 approval, dismiss stale approvals; chặn force push và xoá nhánh.
- Require status checks: `lint`, `typecheck`, `test`, `build` (và `conventional-title`, `template-sections` khi đã có `pr-title.yml`, `pr-body.yml`).
- `dev`: require linear history (chỉ squash merge).
- `main`: không bật linear history, vì PR release dùng merge commit.
- Settings → bật "Allow squash merging" và "Allow merge commits", tắt "Allow rebase merging"; bật "Automatically delete head branches". Không xoá được `dev` vì đã chặn xoá nhánh.

---

## Git hooks (Husky)

| Hook         | Lệnh                                 | Mục đích                                   |
| ------------ | ------------------------------------ | ------------------------------------------ |
| `pre-commit` | `npx lint-staged`                    | ESLint `--fix` + Prettier trên file staged |
| `commit-msg` | `npx --no -- commitlint --edit "$1"` | Kiểm tra format commit                     |
| `pre-push`   | `npm run typecheck`                  | Chặn push code sai type                    |

`lint-staged.config.ts`:

> Nguồn: [`lint-staged.config.ts`](lint-staged.config.ts) — tài liệu không chép lại code, đọc file.

`--no-verify` chỉ dùng khi khẩn cấp và phải ghi lý do trong PR. Test để CI chạy, không chạy trong hook.

---

## GitHub

`.github/pull_request_template.md`:

> Nguồn: [`.github/pull_request_template.md`](.github/pull_request_template.md) — tài liệu không chép lại code, đọc file.

`.github/ISSUE_TEMPLATE/bug_report.md`: Mô tả · Các bước tái hiện · Kết quả mong đợi · Kết quả thực tế · Môi trường · Ảnh/log.

`.github/ISSUE_TEMPLATE/feature_request.md`: Bối cảnh · Yêu cầu · Tiêu chí chấp nhận · Quyền (role nào dùng) · Thiết kế (link Figma).

Tra cứu: [Mục lục chủ đề](docs/conventions/README.md) · [Toàn bộ tài liệu](docs/README.md).
