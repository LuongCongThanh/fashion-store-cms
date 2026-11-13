# 06 — Voucher screens on the admin API (promotions → vouchers)

Status: resolved
Spec: `docs/plans/cms-restructure-plan.md` Voucher, PR V.1 (C2, C6)

## What to build

- Pin `openapi-v0.7.0`, regenerate types.
- Rename `src/features/promotions/` to `src/features/vouchers/`; rewrite `api/`, `types/`, schema and editor from `CreateVoucherDto` / `UpdateVoucherDto` / `VoucherResponseDto`; adapt form, table, filters, status badge and views.
- Routes `/vouchers`, menu Hàng hoá, permissions `PRICING_VOUCHER_VIEW` / `PRICING_VOUCHER_MANAGE`; drop `promotion:*` from `PendingPermission`; i18n `promotion*` → `voucher*`.
- B2 rules: code never changes after create; an unused Voucher is fully editable and deletable; a used one only changes end time, total limit (≥ used), per-buyer limit and active flag.

## Acceptance criteria

- `git grep -i -E "promotion|coupon" -- src` is empty.
- Admin creates, edits, deactivates and deletes a Voucher against the real API; Staff does not see the menu.
- `typecheck`, `lint`, `knip`, `build`, `test` pass.

## Comments

- 2026-11-14: done in #74.
