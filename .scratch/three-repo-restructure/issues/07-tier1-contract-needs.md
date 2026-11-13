# 07 — Tier 1: what the CMS needs from the API contract

Status: ready-for-human
Spec: `docs/plans/cms-restructure-plan.md` Tier 1 (C8, C13, C14, C17). Input for the be-demo Tier 1 grill; it lists data and actions the CMS screens need, not the API design.

Sources: `be-demo/docs/business/03-user-stories.md` (US-601, US-602, US-604, US-701, US-702, US-1002), `05-order-lifecycle.md`, `02-actors-permissions.md`.

## inventory (US-701, US-702)

- List per Variant (SKU, Product name, size, color) with: Tồn kho, Giữ hàng, Hàng chờ xuất, Số lượng bán được (Hàng trên kệ is derivable).
- Filters: search SKU / Product name; Số lượng bán được below a threshold the Staff types (default 5, not a setting).
- Nhập kho: quantity per Variant.
- Điều chỉnh tăng/giảm with a required reason from a fixed list; a decrease above Số lượng bán được returns an error carrying the maximum allowed (BR-INV-11) so the form can show it.
- Sổ biến động (InventoryMovement): per row time, Variant, type (nhập / điều chỉnh / giữ / xuất…), signed quantity, reason, reference (Order code when any), actor; filters by Variant, type, date range; paginated.

## orders (US-601, US-602, US-604)

- List filters: status (9 business codes), payment method, date range, search by Order code or phone. The current CMS filters `paymentStatus`, `customerId`, amount range and sort by total are dropped unless the API offers them.
- List row: Order code, placed at, Buyer name + phone, total, status, payment method.
- Detail: Order lines with price snapshot and Voucher allocation (ADR 0012), subtotal / discount / shipping fee / total, Buyer + delivery address, payment method, status history (from → to, time, actor, reason).
- `allowedActions[]` on the admin Order response for the current status and the caller's permissions (C8). Tier 1 actions: confirm (T6), start packing (T8), cancel (T7/T9, reason required). Bulk confirm (US-602 AC2) as one request or one per Order — API decides.
- No Cờ cần xử lý in Tier 1 (C15): every flag type comes from GHN or payment gateways.

## settings (US-1002)

- Admin only: Phí ship dự phòng, ngưỡng miễn phí ship, hạn mức COD; each change recorded in history. The re-plan's flat shipping fee for Tier 1 lives here.
- Store name, description, contact email, phone, address are static Frontend content at MVP (US-1002 AC2): the current CMS "Thông tin cửa hàng" form has no API and is deleted when settings is rewired.

## Permissions

- New `OPERATIONS_*` values for: order view, order manage (actions), inventory view, inventory manage (receipt, adjustment); `ADMINISTRATION_*` for settings. Staff and Admin both get order and inventory permissions (02-actors-permissions); settings is Admin only.

## Acceptance criteria

- be-demo Tier 1 grill has read this file; answers are recorded back here under `## Comments`.
