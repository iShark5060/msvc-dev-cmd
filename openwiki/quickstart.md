# MSVC Dev Cmd - Quickstart

## Overview

**actions-msvc-dev-cmd** is a GitHub Action that configures the Microsoft Visual C++ Developer Command Prompt on Windows runners. It sets up the necessary environment variables for C/C++ compilation using MSVC toolchains.

### Key Features

- Configures MSVC development environment for Windows runners
- Supports multiple architectures (x64, x86, cross-compilation variants)
- Compatible with Visual Studio 2017-2026 editions
- Handles Windows SDK, toolset, and Spectre mitigation configurations
- No-op on Linux and macOS runners

### Quick Usage

```yaml
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v7
      - uses: iShark5060/actions-msvc-dev-cmd@v1
      - name: Build
        run: |
          cmake -G "NMake Makefiles" .
          nmake
```

## Repository Structure

```
/
├── src/                    # Source code
│   ├── index.js           # Action entry point
│   ├── lib.js             # Core MSVC setup logic
│   └── version.js         # Visual Studio version mappings
├── dist/                  # Built bundles (CJS format)
├── tests/                 # Unit tests
├── .github/workflows/     # CI/CD workflows
├── scripts/               # Utility scripts
└── *.yml, *.json         # Configuration files
```

## Getting Started

### Prerequisites

- GitHub Actions workflow with Windows runner
- Node.js 24+ for development
- pnpm package manager

### Basic Configuration

The action accepts several inputs to customize the MSVC environment:

| Input       | Default | Description                                                |
| ----------- | ------- | ---------------------------------------------------------- |
| `arch`      | `x64`   | Target architecture (`x64`, `x86`, cross-compile variants) |
| `sdk`       | —       | Windows SDK version (e.g., `10.0.10240.0`)                 |
| `toolset`   | —       | VC++ compiler toolset (e.g., `14.0`, `14.11`)              |
| `uwp`       | —       | Set `true` for Universal Windows Platform                  |
| `spectre`   | —       | Set `true` for Spectre-mitigated libraries                 |
| `vsversion` | latest  | Visual Studio version or year                              |

### Development Setup

```bash
# Install dependencies
pnpm install

# Run quality checks
pnpm run validate

# Build the action
pnpm run build

# Run tests
pnpm run test
```

## Documentation Sections

- **[Architecture](architecture/index.md)** - Source organization, core logic, and build process
- **[Workflows](workflows/index.md)** - Usage patterns, input handling, and integration
- **[Operations](operations/index.md)** - Development, testing, and release processes
- **[Domain Concepts](domain/index.md)** - Visual Studio mappings and architecture support

## Important Notes

### Platform Support

- **Windows-only**: The action does nothing on Linux/macOS runners
- **GitHub Hosted Runners**: Compatible with `windows-latest` and other Windows images
- **Self-hosted Runners**: Requires Visual Studio installation

### Versioning

- **Fork**: Maintained fork of [ilammy/msvc-dev-cmd](https://github.com/ilammy/msvc-dev-cmd)
- **Release Tags**: Always reference published version tags (e.g., `@v1`)
- **Bundle**: Built CJS bundle (`dist/index.cjs`) only committed to release tags

### Caveats

1. **Shell Conflicts**: Using `shell: bash` can shadow MSVC tools like `link.exe`
2. **Reconfiguration**: Multiple invocations work but matrix builds are preferred
3. **ARM32**: Removed from Visual Studio 2026+; use `amd64_arm64` or pin older versions

## Next Steps

1. Review the [architecture documentation](architecture/index.md) to understand the core implementation
2. Check [workflow examples](workflows/index.md) for common usage patterns
3. Read [operations guide](operations/index.md) for development and release processes
4. Explore [domain concepts](domain/index.md) for Visual Studio-specific details

## Source References

- [README.md](/README.md) - Project overview and usage
- [action.yml](/action.yml) - Action metadata and inputs
- [AGENTS.md](/AGENTS.md) - Existing agent guidance
- [package.json](/package.json) - Dependencies and build scripts
