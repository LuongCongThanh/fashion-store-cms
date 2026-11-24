# GitHub Copilot Instructions

Follow the repository guidance in [`AGENTS.md`](../AGENTS.md) and [`CLAUDE.md`](../CLAUDE.md). `CLAUDE.md` contains the shared workflow, design contract, and AI configuration policy; do not replace its repository-specific instructions with rules from another project.

Before changing application code, consult [`docs/CONVENTIONS.md`](../docs/CONVENTIONS.md). For architecture and UI work, also follow [`docs/FE_architecture.md`](../docs/FE_architecture.md) and [`DESIGN.md`](../DESIGN.md). Use the existing npm scripts in [`package.json`](../package.json).

Project skills are available under `.github/skills/`. Their canonical copies live in `.agents/skills/`; follow the synchronization policy in `CLAUDE.md` when changing them. Keep CMS issue tracking, `ship-pr`, GitHub workflows, and PR templates specific to this repository.
