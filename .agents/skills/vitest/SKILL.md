---
name: vitest
description: Use when adding or changing CMS unit/component tests, mocks, fixtures, coverage, or Vitest configuration. Follow this repo's installed Vitest version and existing Vue test setup.
---

# Vitest in the CMS

- Check `package.json`, the lockfile, the Vitest configuration, and nearby tests before using an API or changing test setup. This repository's declared scripts and installed version are authoritative; do not assume another repository's Vitest version.
- Keep tests near the code they exercise and follow existing Vue Test Utils, jsdom, and project setup patterns.
- Prefer observable behavior and focused assertions. Reuse existing fixtures and helpers; do not add dependencies or global setup without a concrete need.
- Use `npm test` for the test suite, or pass a focused test path through the existing npm script. Use `npm run test:coverage` when coverage is relevant.
- When changing configuration, verify the smallest affected test first, then run `npm run typecheck` and other applicable checks.

Read the installed-version documentation when an API's availability or behavior is uncertain. Do not copy examples from a different Vitest major version without checking compatibility.
