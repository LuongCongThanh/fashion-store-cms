# Git và hooks — lịch sử scaffold

## C. Git

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

### C.1. Nhánh

- Trunk-based: mọi nhánh tách từ `main`, sống ngắn (≤ 3 ngày), merge lại `main` qua PR.
- Không có `develop`. Release bằng tag `vX.Y.Z` trên `main`.
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

### C.2. Commit message — Conventional Commits

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

### C.3. Pull Request

- Tiêu đề PR theo format commit (vì squash merge dùng tiêu đề PR làm commit message).
- ≤ ~400 dòng thay đổi (không tính file generated / lock); lớn hơn thì tách.
- Bắt buộc: CI xanh + ≥ 1 approve; resolve hết conversation.
- **Squash merge** duy nhất; xoá nhánh sau khi merge.
- Rebase lên `main` khi bị lệch, không merge `main` vào nhánh.

### C.4. Bảo vệ `main` (làm tay trên GitHub)

- Require PR, 1 approval, dismiss stale approvals.
- Require status checks: `lint`, `typecheck`, `test`, `build`.
- Require linear history; chặn force push và xoá nhánh.
- Settings → chỉ bật "Allow squash merging", bật "Automatically delete head branches".

---

## D. Git hooks (Husky)

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

| Hook         | Lệnh                                 | Mục đích                                   |
| ------------ | ------------------------------------ | ------------------------------------------ |
| `pre-commit` | `npx lint-staged`                    | ESLint `--fix` + Prettier trên file staged |
| `commit-msg` | `npx --no -- commitlint --edit "$1"` | Kiểm tra format commit                     |
| `pre-push`   | `npm run typecheck`                  | Chặn push code sai type                    |

`lint-staged.config.ts`:

```ts
export default {
  '*.{ts,vue}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css,yml}': ['prettier --write'],
}
```

`--no-verify` chỉ dùng khi khẩn cấp và phải ghi lý do trong PR. Test để CI chạy, không chạy trong hook.

---
