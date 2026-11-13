# 02 — Remove prototype code and dev-only screens

Status: ready-for-agent
Spec: `docs/plans/cms-restructure-plan.md` Tier 0, PR 0.1 (C5, C16)

## What to build

Delete code that only ran on fixtures in dev: `src/features/dashboard/prototype/`, `src/features/orders/prototype/`, `src/shared/components/prototype/`, `UsePrototypeVariant` (if present), `src/app/views/DesignSystemView.vue`, the dev routes in `src/app/router/Routes.ts`, `scripts/CodexUsage.ts` and its npm script, plus i18n keys used only by them.

## Acceptance criteria

- `git grep -i -E "prototype|DesignSystem|CodexUsage" -- src scripts package.json` is empty.
- `typecheck`, `lint`, `knip`, `build`, `test` pass; specs of deleted code are deleted (C11), no new tests.
