---
name: feature
description: Use when implementing a feature, behavior change, or bug fix in the Fashion Store CMS. Discover the relevant Vue/Vite conventions, make a focused change, verify it with this repo's npm scripts, and report the exact checks run.
---

# Feature workflow

1. Read `AGENTS.md` and `CLAUDE.md`. For application changes, read `docs/guides/README.md`; consult `docs/architecture/README.md` for cross-feature or API-boundary work and `DESIGN.md` for UI changes.
2. Resolve behavior and scope from the user's request, existing code, and any relevant spec under `.scratch/`. Ask only about decisions that materially change behavior or scope.
3. Follow the existing Vue 3, TypeScript, Vite, API-client, localization, and UI patterns. Preserve unrelated work and keep changes within the requested feature.
4. Add or update focused tests when behavior changes. Use the existing Vitest setup and npm scripts; do not infer commands from sibling repositories.
5. Run the narrowest relevant checks first. Before reporting completion, run the applicable `npm run lint`, `npm run typecheck`, `npm test`, or `npm run build` checks and state which actually passed.

Do not commit, push, or create a pull request unless the user explicitly requests that GitHub operation.
