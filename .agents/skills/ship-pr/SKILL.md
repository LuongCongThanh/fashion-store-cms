---
name: ship-pr
description: Commit the current task, push its branch, and open a pull request into dev. Use when the user asks to ship finished repository changes or explicitly invokes $ship-pr; do not use for draft planning, code review, merging, or release PRs into main.
---

# Ship PR

Ship the current task as one reviewable pull request. Invocation authorizes creating a branch when needed, committing the intended task changes, pushing that branch, and creating or updating its PR into `dev`. It does not authorize merging the PR.

## Workflow

1. **Load repository rules.** Read the applicable `AGENTS.md`, `CLAUDE.md`, contribution guide, git conventions, and PR template. Treat repository rules and hooks as the source of truth for branch names, commit messages, required checks, and PR sections.

2. **Pin the scope.** Inspect the current branch, status, diff, and commits relative to `dev`. Separate the task changes from unrelated work. Keep unrelated files unstaged; if ownership is ambiguous, ask one concise question before mutating git state.

3. **Ensure a task branch.** If already on a non-base branch, keep it. If on `dev`, `main`, `master`, or detached HEAD, create a short-lived branch whose name follows the repository convention and describes the diff. Confirm the branch points at the current work before continuing.

4. **Verify before shipping.** Run the checks required by repository docs or the PR checklist. Use the narrowest commands that satisfy those rules, then expand when shared code or risk warrants it. Stop on a failing check and report the failure; do not create a knowingly red PR unless the user explicitly requests a draft with the failure documented.

5. **Commit the intended change.** Stage only the task files. Derive the commit subject from the staged diff and follow the repository's commit template or Conventional Commits rules. Include a body/footer only when the repository requires it or it explains a non-obvious decision. If the working tree is clean and the task is already committed, reuse those commits instead of creating an empty commit.

6. **Push safely.** Push the current branch to `origin`, setting upstream when absent. Never force-push unless the user explicitly asks for it. Confirm local and remote branch tips match.

7. **Create the PR into `dev`.** Check for an existing PR from the current branch first. Reuse it rather than creating a duplicate, updating title/body only when they no longer describe the pushed diff. Otherwise create a non-draft PR with:
   - base `dev` and the current branch as head;
   - a title that follows the repository's PR/commit convention;
   - every required section from the repository PR template;
   - a concise behavior-focused summary, concrete verification evidence, known gaps/risks, migrations or API impact, and accurate checklist state.

8. **Report completion.** Return the commit SHA, pushed branch, PR number/link, checks run, and any pending CI or reviewer action. Completion means the intended files are committed, the branch is tracking its remote, and exactly one open PR targets `dev`.

## Guardrails

- Preserve existing user changes and commits; never discard, rewrite, amend, rebase, or reset them merely to make the history cleaner.
- Avoid staging generated artifacts unless repository rules require them.
- Never claim a check, screenshot, review, or checklist item passed without evidence from this run or an unchanged relevant run.
- Stop before committing secrets, credentials, personal data, merge-conflict markers, or unresolved destructive migrations.
- When `dev` does not exist or the requested work is a release/hotfix with a different target, report the mismatch and ask for the target instead of guessing.
