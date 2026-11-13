# 05 — Dashboard products widget from the API; menu in three groups

Status: ready-for-agent
Spec: `docs/plans/cms-restructure-plan.md` Tier 0, PR 0.4 (C7, C9)

## What to build

- The dashboard `products` widget reads the product count from the admin product list API (`meta.total`) instead of `/dashboard/products`; widgets without an API stay hidden behind `PendingPermission`.
- Sidebar menu grouped as Hàng hoá (products, categories, sizes, colors, vouchers) · Vận hành (orders, inventory, customers) · Quản trị (accounts, roles, settings).

## Acceptance criteria

- No request to `/dashboard/*` when logged in as Admin.
- Menu shows the three groups; hidden screens stay hidden.
- `typecheck`, `lint`, `knip`, `build`, `test` pass.
