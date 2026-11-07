# 14 — Đối chiếu và chốt

Status: ready-for-agent
Blocked by: 10, 11, 12, 13
Nguồn: Step 7 trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 7 — Đối chiếu và chốt

**Làm gì**

- So cây thư mục thực tế với §A, sửa chỗ lệch; `npm run lint` toàn repo pass.
- Tách tài liệu (§ nguyên tắc): §B–§U → `docs/CONVENTIONS.md` (bỏ phần lịch sử/lý do dài); bảng quyết định D + lý do (§V) giữ nguyên trong plan đã archive; plan → `docs/archive/scaffold-plan.md`. `FE_architecture.md` link sang `CONVENTIONS.md` thay vì lặp lại.
- Sửa link: `grep -n 'scaffold-plan' docs/FE_architecture.md README.md` phải về 0 kết quả — mỗi link (D-số, §B–§U) đổi sang mục tương ứng trong `CONVENTIONS.md`; link tới lý do quyết định (§V) đổi sang `docs/archive/scaffold-plan.md`.

**Commit / PR (D27):** mỗi step là một nhánh + PR riêng, squash merge vào `main` (VD `chore(config): init vite project`, `chore(config): add eslint prettier husky`, `feat(api): add http client with refresh seam`…). Step 1 chưa có hook nên tự kiểm tra format commit; từ Step 2 hook tự chặn. Chỉ commit/push khi được đồng ý.

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

_Không có phần tham chiếu riêng; dùng phần dùng chung._
