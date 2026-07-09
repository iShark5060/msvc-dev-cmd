# actions-msvc-dev-cmd

GitHub Action for configuring the MSVC Developer Command Prompt on Windows runners.

## Architecture

- `src/index.js` — entry point: read inputs and invoke setup
- `src/lib.js` — MSVC environment setup and Windows-specific logic
- `src/version.js` — Visual Studio version/year mapping helpers
- `action.yml` — action metadata
- `dist/index.js` — published CJS bundle (committed on release tags only)

Source files use ESM (`"type": "module"`); the published bundle must stay **CJS** (`--format=cjs`).

## Core rules

- Prefer narrow behavior fixes over structural churn.
- Treat GitHub platform behavior and Windows runner images as distinct from action behavior.
- Preserve the current vcvarsall-based setup flow unless there is strong evidence it needs to change.
- Windows-only logic is hard to unit-test on Linux CI; rely on integration jobs for regression coverage.

## Contract sync

When behavior changes, update:

- `README.md`
- `action.yml`
- tests under `tests/`
- regenerate `dist/index.js` with `pnpm run build`

## Verification

```bash
pnpm run validate
pnpm run build
```

Integration jobs in `.github/workflows/ci.yml` cover Windows compilation scenarios.

## Release

1. Create a pre-release from `main`
2. Verify the Release workflow completes
3. Promote to a full release when ready
