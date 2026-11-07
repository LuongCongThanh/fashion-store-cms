# 03 — GitHub template và CI

Status: ready-for-agent
Blocked by: 02
Nguồn: Step 2b trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41, trong đó D24, D32 đã huỷ), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 2b — GitHub

**Làm gì**

- PR template, issue templates theo §F.1.
- `.github/workflows/ci.yml`: `npm ci` → `lint` → `typecheck` → `test` → `build` (e2e thêm khi có flow thật).
- Bảo vệ `main` theo §C.4 — **bạn bật tay trên GitHub**.

**Kiểm tra:** mở PR thử thấy template; CI chạy xanh.

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

### C. Git

#### C.1. Nhánh

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

#### C.2. Commit message — Conventional Commits

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

#### C.3. Pull Request

- Tiêu đề PR theo format commit (vì squash merge dùng tiêu đề PR làm commit message).
- ≤ ~400 dòng thay đổi (không tính file generated / lock); lớn hơn thì tách.
- Bắt buộc: CI xanh + ≥ 1 approve; resolve hết conversation.
- **Squash merge** duy nhất; xoá nhánh sau khi merge.
- Rebase lên `main` khi bị lệch, không merge `main` vào nhánh.

#### C.4. Bảo vệ `main` (làm tay trên GitHub)

- Require PR, 1 approval, dismiss stale approvals.
- Require status checks: `lint`, `typecheck`, `test`, `build`.
- Require linear history; chặn force push và xoá nhánh.
- Settings → chỉ bật "Allow squash merging", bật "Automatically delete head branches".

### F. Template

#### F.1. GitHub

`.github/pull_request_template.md`:

```md
### Mục đích

<!-- Ticket: CMS-xxx -->

### Thay đổi chính

-

### Cách test

-

### Ảnh chụp (nếu có UI)

### Checklist

- [ ] Tiêu đề PR theo Conventional Commits
- [ ] Đã thêm/cập nhật test
- [ ] Đã thêm i18n key (vi + en)
- [ ] Không import chéo feature
- [ ] Không có DTO ngoài `api/`; component không gọi API (§T)
- [ ] Chỉ dùng màu ngữ nghĩa, không mã màu / palette thô (§L)
- [ ] Đã kiểm tra quyền (RBAC) nếu có màn hình mới
```

`.github/ISSUE_TEMPLATE/bug_report.md`: Mô tả · Các bước tái hiện · Kết quả mong đợi · Kết quả thực tế · Môi trường · Ảnh/log.

`.github/ISSUE_TEMPLATE/feature_request.md`: Bối cảnh · Yêu cầu · Tiêu chí chấp nhận · Quyền (role nào dùng) · Thiết kế (link Figma).
