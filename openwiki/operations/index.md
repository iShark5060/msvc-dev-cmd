# Operations

## Overview

This section covers development workflows, testing strategies, release processes, and maintenance operations for the MSVC Dev Cmd action.

## Development Environment

### Prerequisites

- **Node.js**: Version 24 or higher
- **Package Manager**: pnpm (version specified in `.tool-versions`)
- **Git**: For version control
- **Windows Environment**: For testing MSVC integration (optional for basic development)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/iShark5060/actions-msvc-dev-cmd.git
cd actions-msvc-dev-cmd

# Install dependencies
pnpm install

# Run initial validation
pnpm run validate
```

## Development Workflow

### Package Scripts

The project uses pnpm scripts defined in `package.json`:

| Script          | Purpose                      | Usage                    |
| --------------- | ---------------------------- | ------------------------ |
| `validate`      | Run all quality checks       | `pnpm run validate`      |
| `lint`          | Check code with oxlint       | `pnpm run lint`          |
| `lint:fix`      | Fix linting issues           | `pnpm run lint:fix`      |
| `format`        | Format code with oxfmt       | `pnpm run format`        |
| `check-format`  | Check formatting             | `pnpm run check-format`  |
| `test`          | Run unit tests               | `pnpm run test`          |
| `test:coverage` | Run tests with coverage      | `pnpm run test:coverage` |
| `build`         | Build production bundle      | `pnpm run build`         |
| `build-debug`   | Build with sourcemaps        | `pnpm run build-debug`   |
| `deps`          | Check for dependency updates | `pnpm run deps`          |
| `deps:update`   | Update dependencies          | `pnpm run deps:update`   |

### Typical Development Cycle

```bash
# 1. Make changes to source files
edit src/lib.js

# 2. Run quality checks
pnpm run validate

# 3. Run tests
pnpm run test

# 4. Build bundle
pnpm run build

# 5. Test locally (if on Windows)
# ... manual testing in GitHub Actions workflow

# 6. Commit changes
git add .
git commit -m "Description of changes"
```

### Quality Checks

The `validate` script (in `run-quality-checks.mjs`) runs:

1. Linting with oxlint
2. Format checking with oxfmt
3. Type checking (if TypeScript files exist)
4. Unit tests with vitest

## Testing Strategy

### Unit Tests

**Location**: `tests/` directory
**Framework**: Vitest
**Coverage**: v8 coverage via `@vitest/coverage-v8`

#### Current Test Coverage

- `version.test.js`: Tests for Visual Studio version/year mappings
- **Coverage Gap**: No tests for `lib.js` due to Windows dependency

#### Running Tests

```bash
# Run all tests
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Watch mode (development)
npx vitest
```

### Integration Tests

**Location**: `.github/workflows/ci.yml`
**Type**: GitHub Actions workflow jobs
**Platform**: Windows runners with actual MSVC installations

#### Integration Test Scenarios

1. **Basic Setup**: Default parameters on windows-latest
2. **Architecture Matrix**: Multiple architecture configurations
3. **Error Cases**: Invalid parameter handling

#### Manual Testing

For Windows-specific functionality, manual testing is required:

```bash
# Build the action
pnpm run build

# Create test workflow in separate repository
# Reference local action with:
uses: ./path/to/local/action
```

## Build Process

### Bundle Configuration

The action uses esbuild to create a CommonJS bundle:

- **Source**: ESM modules (`"type": "module"`)
- **Target**: Node.js 24
- **Format**: CommonJS (required by GitHub Actions)
- **Output**: `dist/index.cjs`

### Build Commands

```bash
# Production build (minified)
pnpm run build

# Debug build (sourcemaps, kept names)
pnpm run build-debug
```

### Bundle Management

- **Development**: Local builds for testing
- **CI**: Build step in validation workflow
- **Release**: Bundle committed only to release tags
- **`.gitignore`**: `dist/index.cjs` excluded from main branch

## Release Process

### Release Workflow

**File**: `.github/workflows/release.yml`
**Trigger**: Push to `release/v1` branch or manual dispatch
**Steps**:

1. Checkout code
2. Setup Node.js and pnpm
3. Install dependencies
4. Run quality checks
5. Build production bundle
6. Create GitHub release with attestation

### Release Preparation

```bash
# 1. Ensure main branch is clean and tested
git checkout main
git pull
pnpm run validate

# 2. Create release branch
git checkout -b release/v1

# 3. Build bundle for release
pnpm run build

# 4. Commit bundle (only for release)
git add dist/index.cjs
git commit -m "Build v1.x.x"

# 5. Push to trigger release workflow
git push origin release/v1
```

### Release Artifacts

- **Action Bundle**: `dist/index.cjs`
- **Source Code**: All source files
- **Documentation**: README, LICENSE, etc.
- **Attestation**: Build provenance via GitHub Actions

### Version Management

- **Version in `package.json`**: `1.13.0-dev` (development version)
- **Release Tags**: Semantic version tags (`v1.13.0`)
- **Action Reference**: Users specify `@v1` (major version)

## CI/CD Pipeline

### Continuous Integration

**File**: `.github/workflows/ci.yml`
**Triggers**: Push, pull request, schedule, manual
**Jobs**:

1. **Validate**: Code quality checks on Ubuntu
2. **Integration**: Windows-specific tests on Windows runners

#### Validation Job (Ubuntu)

- Setup pnpm and Node.js
- Install dependencies
- Run quality checks (`pnpm run validate`)
- Build action bundle

#### Integration Job (Windows)

- Tests actual MSVC setup on Windows runners
- Multiple architecture configurations
- Error case validation

### Dependabot Configuration

**File**: `.github/dependabot.yml`
**Schedule**: Monthly updates
**Scope**: GitHub Actions and npm dependencies

## Maintenance Operations

### Dependency Updates

```bash
# Check for updates
pnpm run deps

# Update all dependencies (except @types/node)
pnpm run deps:update

# Manual update of specific package
pnpm add -D package-name@latest
```

### Code Quality Tools

- **Linter**: oxlint with `.oxlintrc.json` configuration
- **Formatter**: oxfmt with `.oxfmtrc.json` configuration
- **Type Checking**: Configured in `vitest.config.ts`

### Configuration Files

- **`.npmrc`**: npm configuration
- **`.tool-versions`**: Runtime version specification
- **`pnpm-workspace.yaml`**: pnpm workspace configuration (single package)

## Troubleshooting Development Issues

### Common Problems

#### 1. Build Failures

```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Check Node.js version
node --version  # Should be 24+
```

#### 2. Test Failures

```bash
# Run specific test file
npx vitest tests/version.test.js

# Debug test
npx vitest --reporter=verbose tests/version.test.js
```

#### 3. Linting/Formatting Issues

```bash
# Auto-fix linting issues
pnpm run lint:fix

# Auto-format code
pnpm run format
```

### Windows-Specific Development

For testing Windows functionality without CI:

1. Use Windows development machine
2. Install Visual Studio with C++ tools
3. Test locally with sample workflows
4. Use Windows Subsystem for Linux (WSL) for cross-platform development

## Source References

### Configuration Files

- [`package.json`](/package.json) - Scripts and dependencies
- [`vitest.config.ts`](/vitest.config.ts) - Test configuration
- [`.github/workflows/ci.yml`](/.github/workflows/ci.yml) - CI pipeline
- [`.github/workflows/release.yml`](/.github/workflows/release.yml) - Release workflow

### Utility Scripts

- [`run-quality-checks.mjs`](/run-quality-checks.mjs) - Validation script
- [`scripts/runtime-preflight.mjs`](/scripts/runtime-preflight.mjs) - Runtime checks

### Documentation

- [`AGENTS.md`](/AGENTS.md) - Existing agent guidance
- [`README.md`](/README.md) - User documentation

## Related Documentation

- [Architecture](architecture/index.md) - Source organization and build process
- [Workflows](workflows/index.md) - Action usage patterns
- [Domain Concepts](domain/index.md) - Visual Studio specifics
