# CLAUDE.md

## UI

Read `DESIGN.md` before changing any UI. It is the design contract; external design skills only advise or audit.

## Agent skills

### Issue tracker

Issues and specs are tracked as local markdown files under `docs/plans/tasks/{todo,done,wontfix}/<feature>/`, Wayfinder maps under `docs/plans/wayfinding/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: one `GLOSSARY.md` at the repo root. See `docs/agents/domain.md`.

## Repository workflow

- Read `docs/guides/README.md` before changing application code, and `docs/architecture/README.md` when a change crosses feature or API boundaries.
- Read `DESIGN.md` before changing UI; it remains the visual contract.
- Use `feature` for implementation work, `vitest` for test-related work, and `api-security-review` only for static, read-only review of API contracts or client-side security handling.
- `api-security-review` does not authorize requests to running services, active scans, or use of credentials. Review client-visible code and contracts only; backend authorization must be verified in the backend repository.
- Issues and specs live under `docs/plans/tasks/`; use `.agents/skills/ship-pr/` only when the user explicitly asks to ship a change. Do not commit, push, or open a PR otherwise.
- Use the repository's declared npm scripts and existing test/configuration patterns. Do not assume commands or framework conventions from sibling repositories.

## AI configuration and skills

- Keep repository-wide instructions in this file; `AGENTS.md` points here. Platform entrypoints should link to these files instead of copying their rules.
- `.agents/skills/` is the canonical source for project skills. The skills intentionally exposed to Claude Code and GitHub Copilot are mirrored under `.claude/skills/` and `.github/skills/`.
- Edit a skill in `.agents/skills/`, then update its selected mirrors in the same change. Do not edit a mirror alone. Before finishing, compare each selected mirror with its canonical skill, including any reference files.
- Claude settings/hooks, Codex settings/hooks, and Copilot-specific files keep their native formats. Preserve their existing permissions, hooks, and workflow behavior; do not copy local settings or absolute machine paths between platforms.
