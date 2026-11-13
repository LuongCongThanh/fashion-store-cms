# 04 — Dissolve the media feature; drop logo and Localization settings

Status: resolved
Spec: `docs/plans/cms-restructure-plan.md` Tier 0, PR 0.3 (C4, C10)

## What to build

- Move `ImageUploader.vue` into `src/features/products/components/`; it takes its upload behaviour from the products presign flow (`admin/products/:id/images/presign`).
- Delete the rest of `src/features/media/` (`/media/presign` does not exist in the API).
- Remove the store logo upload from settings and delete the Localization settings screen, form, composable, route and i18n keys (the API has no such settings).

## Acceptance criteria

- `git grep -E "features/media|/media/" -- src` is empty.
- Product image upload still works against the real API (manual run).
- `typecheck`, `lint`, `knip`, `build`, `test` pass.

## Comments

- 2026-11-14: done in #72.
