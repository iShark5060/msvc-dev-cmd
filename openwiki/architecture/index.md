# Architecture

## Overview

The MSVC Dev Cmd action follows a straightforward architecture focused on interacting with Windows batch files to configure the MSVC development environment. The core implementation is in JavaScript/Node.js with a build step that produces a CommonJS bundle for GitHub Actions compatibility.

## Source Organization

### Entry Point (`src/index.js`)

- **Purpose**: Reads GitHub Actions inputs and invokes the setup function
- **Key Logic**: Input parsing via `@actions/core` and error handling
- **Size**: Minimal wrapper (15 lines) that delegates to `lib.js`

### Core Logic (`src/lib.js`)

- **Purpose**: Contains all MSVC environment setup logic
- **Key Functions**:
  - `findVcvarsall()`: Locates `vcvarsall.bat` using vswhere or standard paths
  - `setupMSVCDevCmd()`: Main setup function that executes batch file and processes environment
  - `filterPathValue()`: Deduplicates PATH-like environment variables
- **Size**: ~200 lines of Windows-specific logic

### Version Mapping (`src/version.js`)

- **Purpose**: Maps Visual Studio years to version numbers and vice versa
- **Data Structure**: `VsYearVersion` object with year→version mappings
- **Key Functions**: `vsversion_to_versionnumber()`, `vsversion_to_year()`

## Execution Flow

1. **Input Validation**: Action inputs are read via `@actions/core`
2. **Platform Check**: Returns early if not running on Windows (`win32`)
3. **vcvarsall Discovery**: Searches for `vcvarsall.bat` using:
   - `vswhere` tool (preferred)
   - Standard Visual Studio installation paths
   - Visual Studio 2015 Build Tools location
4. **Batch Execution**: Runs `vcvarsall.bat` with appropriate arguments
5. **Environment Capture**: Executes `set` commands before/after to capture environment changes
6. **Variable Export**: Compares old/new environment and exports changed variables
7. **Path Deduplication**: Filters duplicate entries from PATH-like variables

## Key Design Decisions

### 1. Batch File Interaction Pattern

The action uses a clever hack to capture environment changes:

```javascript
const cmd_output_string = child_process
  .execSync(`set && cls && ${vcvars} && cls && set`, { shell: 'cmd' })
  .toString();
```

- `set`: Captures initial environment
- `cls`: Clears screen (provides separator via form feed `\f`)
- `vcvars`: Executes the MSVC configuration
- `cls`: Another separator
- `set`: Captures final environment

### 2. Environment Variable Handling

- **Changed Variables Only**: Only exports variables that changed
- **Path Deduplication**: Prevents variable overflow from repeated invocations
- **PATH-like Variables**: Special handling for `PATH`, `INCLUDE`, `LIB`, `LIBPATH`

### 3. Error Detection

- **Batch File Errors**: `vcvarsall.bat` can succeed with error output
- **Pattern Matching**: Looks for `[ERROR...]` lines in output
- **Validation**: Fails action if error patterns detected

## Build Process

### Module System

- **Source**: ESM (`"type": "module"` in package.json)
- **Bundle**: CJS format (`dist/index.cjs`) for GitHub Actions compatibility
- **Build Tool**: esbuild with Node.js 24 target

### Build Configuration

```json
"build": "esbuild src/index.js --bundle --platform=node --format=cjs --target=node24 --outfile=dist/index.cjs --minify"
```

### Bundle Management

- **Release Tags Only**: `dist/index.cjs` committed only to release tags
- **Development**: `pnpm run build` generates bundle locally
- **CI**: Build step included in validation workflow

## Dependencies

### Runtime Dependencies

- `@actions/core`: GitHub Actions SDK for input/output handling

### Development Dependencies

- `esbuild`: JavaScript bundler
- `vitest`: Test framework with coverage
- `oxlint`: JavaScript linter
- `oxfmt`: Code formatter

## Windows-Specific Implementation

### Visual Studio Discovery

1. **vswhere Priority**: Uses Microsoft's installation discovery tool
2. **Fallback Paths**: Standard `Program Files` locations for each VS edition/year
3. **Edition Support**: Enterprise, Professional, Community, BuildTools
4. **Year Support**: 2017, 2019, 2022, 2026

### Architecture Support

- **Native**: `x64`, `x86` (with aliases like `win32`, `win64`)
- **Cross-compilation**: `amd64_x86`, `amd64_arm64`, `x86_arm64`
- **ARM32 Deprecation**: Removed in VS 2026; requires pinning older versions

## Source Map

### Core Files

- [`src/index.js`](/src/index.js) - Action entry point (15 lines)
- [`src/lib.js`](/src/lib.js) - MSVC setup logic (~200 lines)
- [`src/version.js`](/src/version.js) - Version mappings (31 lines)

### Configuration

- [`action.yml`](/action.yml) - Action metadata and inputs
- [`package.json`](/package.json) - Dependencies and scripts
- [`vitest.config.ts`](/vitest.config.ts) - Test configuration

### Build Output

- [`dist/index.cjs`](/dist/index.cjs) - Built CJS bundle (release tags only)

## Extension Points

### Adding New Architecture Support

1. Update architecture aliases in `lib.js` (lines 106-115)
2. Add to documentation in `README.md`
3. Update test matrix in CI workflow

### Supporting New Visual Studio Versions

1. Add year→version mapping in `version.js`
2. Add year to `YEARS` array in `lib.js`
3. Update documentation for compatibility

### Environment Variable Processing

- Path deduplication logic in `filterPathValue()` (lines 84-92)
- PATH-like variable detection in `isPathVariable()` (lines 79-82)

## Related Documentation

- [Workflows](workflows/index.md) - Usage patterns and integration
- [Operations](operations/index.md) - Development and release processes
- [Domain Concepts](domain/index.md) - Visual Studio specifics
