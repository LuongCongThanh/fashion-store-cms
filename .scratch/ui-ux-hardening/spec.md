# Spec: UI/UX hardening

Status: ready-for-agent

## Mục tiêu

Đưa giao diện CMS về đúng `DESIGN.md`, theo thứ tự: nền tảng, rồi pattern dùng chung, rồi archetype màn hình, rồi cổng chất lượng.

**Nguồn:**

- Plan: `docs/plans/ui-ux-hardening-plan.md` (#41).
- Contract: `DESIGN.md` (#43).
- Hướng thiết kế đã duyệt: `mockup-decision.md`. Prototype ở #42.
- Audit: `audit-hallmark.md`, `audit-break-ui.md`.

## Quyết định đã chốt

| #   | Chủ đề           | Quyết định                                                                                                                                                     |
| --- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Nguồn luật       | `DESIGN.md` là nguồn duy nhất. Ticket nào cần đổi luật thì sửa `DESIGN.md` trong cùng PR                                                                       |
| Q2  | Archetype        | Dashboard = A + câu tóm tắt. List = bảng dày + tab bộ lọc đã lưu. Detail = hai cột + thanh tiến trình trạng thái (`mockup-decision.md`)                        |
| Q3  | Cách rollout     | Mỗi archetype làm một reference implementation trước (Product list, Product editor, Order detail). Được duyệt rồi mới rollout sang các màn khác                |
| Q4  | Primitive        | Dùng Nuxt UI. Chỉ viết wrapper khi đã chứng minh có khoảng trống                                                                                               |
| Q5  | Màu trạng thái   | Không dùng làm màu chữ. Đi qua badge `subtle`/`soft`                                                                                                           |
| Q6  | Format           | Tiền, số, ngày đi qua `shared/lib/format/` theo locale của app                                                                                                 |
| Q7  | Test             | TDD ở seam công khai: formatter, composable, view qua `renderWithPlugins()`. Phase 6 thêm screenshot và axe, ở chế độ chỉ báo cáo trước, sau đó mới chặn merge |
| Q8  | Dữ liệu xấu nhất | Tái dùng fixture prototype làm fixture test (tên/email/địa chỉ dài, giá lớn, thiếu ảnh, tồn 0)                                                                 |

## Ngoài phạm vi

- Storefront và landing page.
- WebGL/3D.
- Đổi business flow hay API contract.
- Màu brand chính thức (chờ guideline).
- Nút chuyển mật độ.

## Ticket

Xem `issues/`. Làm theo thứ tự ticket nào hết bị chặn thì làm trước (dòng `Blocked by`).
