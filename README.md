# MSVC Dev Cmd

Configure the Microsoft Visual C++ Developer Command Prompt on Windows runners.

[![CI](https://github.com/iShark5060/actions-msvc-dev-cmd/actions/workflows/ci.yml/badge.svg)](https://github.com/iShark5060/actions-msvc-dev-cmd/actions/workflows/ci.yml)

> **Fork notice:** Maintained fork of [ilammy/msvc-dev-cmd](https://github.com/ilammy/msvc-dev-cmd) by ilammy (MIT License).

> **Always reference a published version tag** (e.g. `@v1`). The bundled action code (`dist/index.js`) is only committed to release tags, so referencing `@main` will not work.

Supports Windows. Does nothing on Linux and macOS.

## Usage

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

Matrix builds for multiple architectures:

```yaml
jobs:
  build:
    runs-on: windows-latest
    strategy:
      matrix:
        arch: [amd64, amd64_x86, amd64_arm64]
    steps:
      - uses: actions/checkout@v7
      - uses: iShark5060/actions-msvc-dev-cmd@v1
        with:
          arch: ${{ matrix.arch }}
      - name: Build
        run: |
          cmake -G "NMake Makefiles" .
          nmake
```

## Inputs

| Input       | Default | Description                                                                  |
| ----------- | ------- | ---------------------------------------------------------------------------- |
| `arch`      | `x64`   | Target architecture (`x64`, `x86`, cross-compile variants like `amd64_x86`). |
| `sdk`       | —       | Windows SDK version (e.g. `10.0.10240.0` or `8.1`).                          |
| `toolset`   | —       | VC++ compiler toolset (e.g. `14.0`, `14.11`).                                |
| `uwp`       | —       | Set `true` to build for Universal Windows Platform.                          |
| `spectre`   | —       | Set `true` to use Spectre-mitigated Visual Studio libraries.                 |
| `vsversion` | latest  | Visual Studio version number (e.g. `16.0`) or year (e.g. `2019`).            |

## Caveats

### `shell: bash` path conflicts

GitHub Actions prepends GNU paths when `shell: bash` is used, which can shadow MSVC tools such as `link.exe`. If you see linker errors mentioning "extra operand", that is likely the cause.

### Reconfiguration

You can invoke the action multiple times in one job with different inputs, but using a `strategy.matrix` for parallel builds is preferred.

## License

MIT. See [LICENSE](LICENSE).
