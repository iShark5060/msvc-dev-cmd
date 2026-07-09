# msvc-dev-cmd

This repository is maintained as a small, user-facing GitHub Action for configuring the MSVC Developer Command Prompt on Windows runners.
Optimize for stability, reproducibility, and clear user value over broad rewrites.

## Core Rules

- Prefer narrow behavior fixes over structural churn.
- Reproduce current behavior on `master` before changing code.
- Treat GitHub platform behavior and Windows runner images as distinct from action behavior.
  If the platform controls the outcome, prefer docs or clearer errors over brittle workarounds.
- Avoid standalone refactors with no clear user-facing benefit.

## Current Architecture

- `index.js` is the action entry point: reads inputs and invokes setup.
- `lib.js` owns MSVC environment setup (`setupMSVCDevCmd`) and Windows-specific logic.
- `version.js` owns Visual Studio version/year mapping helpers.
- `dist/index.js` is the esbuild CJS bundle consumed by `action.yml` (`using: node24`).
- Keep behavior-specific logic in `lib.js` or `version.js`; avoid growing `index.js` with ad-hoc branches.

## Contract Sync

When behavior changes, keep the external contract in sync:

- update `README.md`
- update `action.yml`
- update tests under `__tests__/`
- regenerate `dist/index.js` with `pnpm run build`

Docs-only changes do not need `dist/index.js` regeneration.

## Verification

For code changes, run:

- `pnpm run validate`

For behavior changes, also verify the Windows integration and cross-compile jobs in `.github/workflows/main.yml`.

## Implementation Preferences

- Preserve the current vcvarsall-based setup flow unless there is strong evidence it needs to change.
- Source files use ESM (`"type": "module"`); the published bundle must stay **CJS** (`--format=cjs`).
- Be careful with path and environment-variable handling on Windows.
- Windows-only logic is hard to unit-test on Linux CI; rely on integration jobs for regression coverage.
