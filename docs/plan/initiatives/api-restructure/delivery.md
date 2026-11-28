# Cây đích, tier và phụ thuộc Backend

> Kế hoạch API-first; tiến độ là snapshot lịch sử. Giữ quyết định C1–C17, kiểm tracker trước khi triển khai tier tiếp theo.

## Cây thư mục đích

```text
cms/src/
├── app/            App.vue (← src/App.vue), Runtime.ts, config/, providers/, router/ (guard theo permissions[]),
│                   views/ ForbiddenView, NotFoundView        (DesignSystemView xoá)
├── layouts/        AuthLayout, DashboardLayout, Navigation (3 nhóm menu C7)
├── shared/
│   ├── components/ confirm/ feedback/ form/ list/ page/ table/   (prototype/ xoá)
│   ├── composables/ (UsePrototypeVariant xoá nếu còn)
│   ├── lib/api/    client/ errors/ Permission.ts Api.generated.ts (← shared/types/)
│   ├── lib/        session/ form/ format/ i18n/ query/
│   └── types/Pagination.types.ts
└── features/
    auth  dashboard  accounts  roles
    products  categories  sizes  colors  vouchers
    orders  inventory  customers  returns
    settings  audit  compliance
```

Mỗi feature: `api/ components/ composables/ schemas/ stores/ types/ views/` khi cần + `<Feature>.routes.ts`. Không có `pricing/`, `fulfillment/`, `flags/`, `media/`.

## Thứ tự giao

Mỗi PR target `dev`, squash. Kiểm chứng: `typecheck`, `lint`, `knip`, `build`, `gen:api` không lệch, CI xanh, chạy tay trên API thật. Mỗi feature nối API: bỏ chuỗi `PendingPermission` của nó, dùng `Permission` thật, xoá i18n key và spec chết (C11).

### Tier 0 — dọn dẹp (không phụ thuộc API)

| PR  | Nội dung                                                                                                                                                                          |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1 | Xoá `dashboard/prototype`, `orders/prototype`, `shared/components/prototype`, `UsePrototypeVariant`, `DesignSystemView`, dev routes, `scripts/CodexUsage.ts`, i18n key liên quan. |
| 0.2 | Chuyển `shared/types/Api.generated.ts` → `shared/lib/api/Api.generated.ts`; sửa `GenApi.ts`, import, CI check, alias, `GLOSSARY.md` mục Generated API, `docs/conventions/README.md`.   |
| 0.3 | Giải thể `media` (§4); bỏ logo và Localization khỏi `settings`.                                                                                                                   |
| 0.4 | Widget `products` của dashboard đọc API danh sách sản phẩm; menu 3 nhóm C7.                                                                                                       |

Thoát: grep `prototype`, `DesignSystem`, `features/media`, `/media/` sạch; `knip` sạch.

### Voucher (ngay sau Tier 0)

| PR  | Nội dung                                                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V.1 | Nâng pin `openapi-v0.7.0`, sinh lại type. `promotions` → `vouchers` theo §4. Mã Voucher không đổi sau tạo; Voucher đã dùng chỉ sửa giờ kết thúc, giới hạn tổng (≥ đã dùng), giới hạn mỗi người mua, trạng thái active (theo quyết định B2). |

Thoát: Admin tạo/sửa/vô hiệu hoá Voucher trên CMS; Staff không thấy menu.

### Tier 1 — bán COD (sau khi module API có tag, C12)

| PR  | Phụ thuộc API                     | Nội dung                                                                           |
| --- | --------------------------------- | ---------------------------------------------------------------------------------- |
| 1.1 | `inventory`                       | C13 + §4 inventory.                                                                |
| 1.2 | `settings` (US-1002)              | Form theo field API: Phí ship dự phòng, ngưỡng miễn phí ship, hạn mức COD (Admin). |
| 1.3 | `ordering` (+ `allowedActions[]`) | C14 + §4 orders. Cờ ở Tier 3 (C15).                                                |

Thoát: Staff thấy đơn COD Khách vãng lai vừa đặt, đi hết hành động API cho phép tới bàn giao/huỷ; tồn kho trên CMS khớp Giữ hàng/Hàng chờ xuất.

### Tier 2 — tài khoản và vận hành

| PR  | Phụ thuộc API                    | Nội dung                                            |
| --- | -------------------------------- | --------------------------------------------------- |
| 2.1 | danh sách Khách hàng, sổ địa chỉ | `customers` (§4).                                   |
| 2.2 | StockCount (US-703)              | Kiểm kê trong `inventory`.                          |
| 2.3 | báo cáo doanh thu (US-1003)      | `dashboard` widget doanh thu/đơn/khách.             |
| 2.4 | —                                | Xoá type `PendingPermission` (không còn chuỗi nào). |

### Tier 3 — tích hợp

Chi tiết đơn: trạng thái thanh toán VNPay/MoMo, thu COD, tạo và theo dõi vận đơn GHN, Cờ cần xử lý (xem, lọc theo loại, gỡ — US-601 AC2) (giữ `OrderPaymentInfo`, `PaymentStatusBadge`, `OrderShippingInfo`).

### Tier 4 — sau bán hàng và pháp lý

Feature mới `returns` (Đổi trả theo dòng đơn, Hoàn tiền thủ công), `audit` (chỉ đọc, lọc theo người thực hiện/loại thao tác), `compliance` (yêu cầu xoá dữ liệu, log truy cập dữ liệu cá nhân). Kiểm duyệt đánh giá sản phẩm (slice R) grill riêng.

### Cleanup cuối và Phase 7

Grep `StoreScope`, `X-Store-Id`, `prototype`, `Promotion`, `Coupon`, `PendingPermission` sạch; `knip`, `tsc` sạch. Sau đó Phase 7: CMS component + API integration test, Playwright cho các dòng Verification matrix.

## Phụ thuộc chặn sang `be-demo`

| Cần                                                          | Tier | Dùng cho                 |
| ------------------------------------------------------------ | ---- | ------------------------ |
| Nhu cầu hợp đồng Tier 1 (inventory, orders, settings, quyền) | 1    | issue 07                 |
| `allowedActions[]` trong DTO đơn admin                       | 1    | C8                       |
| `OrderFlag`                                                  | 3    | C15                      |
| Quyền `OPERATIONS_*` cho inventory/order/settings            | 1    | Thay `PendingPermission` |
| API danh sách Khách hàng cho back-office                     | 2    | `customers`              |
| Báo cáo doanh thu                                            | 2    | `dashboard`              |

## Rủi ro

- Code `K` chờ tier sau vẫn dựa vào type viết tay; nếu `knip` báo export không dùng thì giữ nguyên tới tier của nó, không xoá sớm.
- Xoá spec theo C11 làm giảm coverage; ngưỡng coverage CI (nếu có) có thể cần hạ tạm, ghi lại để khôi phục ở Phase 7.
- Mỗi lần nâng pin OpenAPI có thể làm gãy feature đã nối; nâng pin trong PR riêng hoặc cùng PR feature cần nó, chạy lại `typecheck` toàn repo.

Tra cứu: [Mục lục chủ đề](map.md) · [Toàn bộ tài liệu](../../../README.md).
