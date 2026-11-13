# 01 — Remove StoreScope / X-Store-Id

Status: resolved
Spec: three-repo restructure, slice 0 (CMS execution step 1)

## What to build

There is one Store and one Warehouse; no tenant or `X-Store-Id` contract exists in the API. Remove the multi-store assumption from the CMS and keep only session, locale/theme and API client state.

- Delete `src/features/StoreScope/` (store, composable, spec) and `src/layouts/components/StoreSwitcher.vue`, plus their usages in layouts/router/runtime.
- `HttpClient` stops sending `X-Store-Id`; `Session` / `Session.store` drop store id / store list fields.
- Remove Store assignment from the users feature (form, table, schema, types, api, editor composable) and from `UseHydrateForm`, `src/test/Render.ts`, `src/app/Runtime*` where present.
- Prototype screens and `DesignSystemView` are NOT in scope (removed after real API wiring, slice F).

## Acceptance criteria

- `git grep -i -E "storescope|x-store-id|storeId|StoreSwitcher" -- src` is empty.
- `typecheck`, `lint`, `build` (and knip if configured) pass.
- Existing tests: only fix imports / delete tests of the deleted StoreScope files; do not add new tests and do not change assertions of surviving tests unless they assert the removed header/field.
- Manual run: login, navigate the shell; no store switcher, requests carry no `X-Store-Id`.
