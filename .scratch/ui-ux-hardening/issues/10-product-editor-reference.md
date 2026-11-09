# 10 — Phase 4.2: Product editor làm reference cho archetype Form

Status: done
Blocked by: 04, 06

Form dài: section navigation, validation summary, action bar dính, label/help/error theo `DESIGN.md`. Bổ sung archetype Form vào `DESIGN.md` mục Layout.

Sau khi duyệt thì Category, Promotion và Settings kế thừa.

Test: ProductForm spec cho validation summary focus vào lỗi đầu tiên.

## Comments
- 2026-11-09: Section nav và card form: `UNavigationMenu` + `UPageCard` + `UForm`/`UFormField` theo cách ghép của `settings/*` trong template.
- 2026-11-10: Product form có section navigation dính, validation summary và tự
  focus control lỗi đầu tiên; action bar dính được giữ làm seam submit. Archetype
  Form đã được ghi vào `DESIGN.md`. Create/Edit view tests pass.
