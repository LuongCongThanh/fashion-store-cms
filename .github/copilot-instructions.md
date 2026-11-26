# GitHub Copilot Instructions

Follow the repository guidance in [`AGENTS.md`](../AGENTS.md) and [`CLAUDE.md`](../CLAUDE.md). `CLAUDE.md` contains the shared workflow, design contract, and AI configuration policy; do not replace its repository-specific instructions with rules from another project.

Before changing application code, consult [`docs/guides/README.md`](../docs/guides/README.md). For architecture and UI work, also follow [`docs/architecture/README.md`](../docs/architecture/README.md) and [`DESIGN.md`](../DESIGN.md). Use the existing npm scripts in [`package.json`](../package.json).

Project skills are available under `.github/skills/`. Their canonical copies live in `.agents/skills/`; follow the synchronization policy in `CLAUDE.md` when changing them. Keep CMS issue tracking, `ship-pr`, GitHub workflows, and PR templates specific to this repository.
