# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `docs/plans/tasks/`, grouped by state: `todo/` (any issue still open), `done/` (every issue closed) and `wontfix/` (dropped, with the reason in its spec). Wayfinder maps live in `docs/plans/wayfinding/`. The index is [`docs/plans/README.md`](../plans/README.md); the `Status:` line in each file stays the source of truth.

**Exception — initial CMS build (historical):** scaffold and prototype evidence is consolidated under `docs/archive/cms-initial-build/`. Each numbered file in `foundation/` or `screens/` contains its original requirements and report in separate sections. These are historical records; new issues still use `docs/plans/tasks/` below.

## Conventions

- One feature per directory: `docs/plans/tasks/todo/<feature-slug>/` while open
- The spec is `<feature-dir>/spec.md`
- Implementation issues are one file per ticket at `<feature-dir>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file (e.g. `needs-triage`, `ready-for-agent`, `wontfix`)
- Status words: implementation issues use the triage labels plus `done` (merged) and `superseded`; Wayfinder tickets use `claimed`/`resolved`. Do not use synonyms such as `completed`.
- When every issue of a feature is `done`, `superseded` or `wontfix`, `git mv` the whole feature directory to `done/`, update links to it and the index in the same change. Dropped features move to `wontfix/`.
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `docs/plans/tasks/todo/<feature-slug>/` (creating the directory if needed) and add the feature to `docs/plans/README.md`.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `docs/plans/wayfinding/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `docs/plans/wayfinding/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `docs/plans/wayfinding/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
