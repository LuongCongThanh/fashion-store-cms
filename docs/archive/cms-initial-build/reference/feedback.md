# P. Dialog, toast: global hay internal

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

| Loại                                                     | Phạm vi                  | Đặt ở                                           | Cách mở                                                                         |
| -------------------------------------------------------- | ------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| Toast (thành công / lỗi)                                 | Global                   | Nuxt UI `UApp` (đã có sẵn)                      | `useNotify()` → `{ success(key), error(e) }`                                    |
| Dialog xác nhận (xoá, huỷ đơn, bỏ thay đổi chưa lưu)     | **Global**, generic      | `shared/components/confirm/ConfirmDialog.vue`   | `await useConfirm()({ title, description, confirmLabel?, color? })` → `boolean` |
| Modal nghiệp vụ (sửa nhanh sản phẩm, chọn ảnh, gán role) | **Internal** của feature | `features/<x>/components/<Entity>Modal.vue`     | `useOverlay().create(Comp)` của Nuxt UI hoặc `<UModal v-model:open>` trong view |
| Slideover chi tiết (xem nhanh đơn hàng)                  | Internal                 | `features/<x>/components/<Entity>Slideover.vue` | Như trên                                                                        |

Quy tắc:

- Dialog global **không** chứa nghiệp vụ, không gọi API, chỉ nhận text / màu qua tham số. Text truyền vào là i18n key đã dịch.
- Feature không đăng ký dialog global mới. Cần dùng lại modal nghiệp vụ ở feature khác → export hàm mở từ `Use<Feature>.ts` (VD `useMedia().pickImages(): Promise<Media[]>`), không import component.
- Một dialog = một Promise: hàm mở trả về kết quả (`boolean`, dữ liệu đã chọn hoặc `null` khi đóng), caller `await`, không dùng event bus / store để điều khiển dialog.
- Rời trang khi form có thay đổi chưa lưu: `onBeforeRouteLeave` + `useConfirm()`.
- Mọi dialog phải đóng được bằng Esc, focus quay về nút mở (Nuxt UI lo sẵn, không tắt).

```ts
// src/shared/components/confirm/UseConfirm.ts
export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  color?: 'primary' | 'error'
}
export function useConfirm(): (options: ConfirmOptions) => Promise<boolean>
```

```ts
// dùng trong view
const confirm = useConfirm()
const { mutate } = useDeleteProduct()

async function onDelete(id: string) {
  if (!(await confirm({ title: t('products.delete.title'), color: 'error' }))) return
  mutate(id, { onSuccess: () => notify.success('products.delete.done') })
  // lỗi → toast global (§O.4)
}
```

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
