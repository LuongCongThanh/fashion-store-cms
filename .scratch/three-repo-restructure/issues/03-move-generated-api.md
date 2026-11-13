# 03 — Move Api.generated.ts to shared/lib/api

Status: ready-for-agent
Spec: `docs/plans/cms-restructure-plan.md` Tier 0, PR 0.2

## What to build

Move `src/shared/types/Api.generated.ts` to `src/shared/lib/api/Api.generated.ts`. Update `scripts/GenApi.ts`, every import, the CI drift check, lint/knip ignores, `GLOSSARY.md` (Generated API) and `docs/CONVENTIONS.md`.

## Acceptance criteria

- `git grep "shared/types/Api.generated"` is empty.
- `npm run gen:api` writes the new path with no diff.
- `typecheck`, `lint`, `knip`, `build`, `test` pass.
