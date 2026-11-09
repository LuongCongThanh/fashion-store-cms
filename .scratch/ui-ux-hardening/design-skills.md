# UI/UX hardening — skill được chọn

Chốt ngày 2026-11-09 (grilling session cho PR #41).

## Dùng

| Repo gốc         | Skill                                                                        | Dùng khi                                      |
| ---------------- | ---------------------------------------------------------------------------- | --------------------------------------------- |
| Google DESIGN.md | `design-md`, `write-design-md`                                               | Viết / cập nhật `DESIGN.md`                   |
| UI/UX Pro Max    | `ui-ux-pro-max`                                                              | Discovery: palette, font pair, UX rule        |
| Hallmark         | `hallmark`                                                                   | Audit contrast, focus, mobile (report-only)   |
| Taste Skill      | `design-taste-frontend`                                                      | Critique thẩm mỹ login, empty state, mockup   |
| Emil Kowalski    | `emil-design-eng`, `break-ui`, `animation-performance`, `improve-animations` | Microinteraction, stress test, reduced motion |
| Impeccable       | thay bằng `anti-ui-slop` / `unslop-ui`                                       | Phát hiện UI rập khuôn                        |
| Bổ sung          | `refactoring-ui`, `web-typography`, `ux-heuristics`                          | Hierarchy, typography, heuristic review       |

## Không dùng trong CMS

React Bits, Canvas UI (React / Commons Clause), Scroll World (3D landing), GSAP (chỉ khi CSS/Vue transition không đủ).

## Quyết định liên quan

- Palette rose + font hiện tại giữ **tạm thời**, ghi rõ trong `DESIGN.md`.
- Không dùng Figma: mockup HTML trước (có thể import Figma qua html.to.design sau).
- Bỏ 2 thuật ngữ thiết kế khỏi `GLOSSARY.md`; README trỏ tới `DESIGN.md`.
- Thứ tự: mockup HTML (Dashboard, Product list, Order detail; light/dark) → user duyệt → `DESIGN.md` → audit `hallmark` + `break-ui`.
- PR #41 merge riêng; mockup + `DESIGN.md` ở PR mới tách từ `dev`.
