# PR: Modernize toolchain — bun, latest deps, Biome + rumdl + lefthook

Closes the 2026 toolchain modernization goal for this repo.

## Changes

### 1. bun as package manager

- Added `packageManager: bun@1.4.2` (lockfile was already `bun.lock`, kept and regenerated).

### 2. All dependencies upgraded to latest

| Package | Before | After |
|---|---|---|
| vitest | ^4.1.2 | ^5.0.3 |
| fast-json-stringify | ^6.3.0 | ^7.0.1 |
| msgpackr | ^1.11.9 | ^2.1.0 |
| avsc / compile-json-stringify / slow-json-stringify | already latest | unchanged |

- `serialize.bench.js` migrated to the Vitest 5 bench API (`bench` is no longer a top-level export; now a test-context fixture: `test('…', async ({ bench }) => …)` with run options passed to `.run(opts)`).

### 3. New toolchain (drop Prettier)

- **Removed:** `.prettierrc` (Prettier was not even a declared dependency — config was vestigial).
- **Added:** Biome 2.5 (`biome.json`, formatter configured to match the old `.prettierrc`: single quotes, 80 width, no trailing commas), rumdl 0.2 (`rumdl.toml`, MD013 disabled for long benchmark output lines), lefthook 2.1 (`lefthook.yml` pre-commit: `biome check --write` on staged JS/JSON, `rumdl check` on staged Markdown).
- `bench-suite.js`: applied Biome safe fixes (arrow functions, template literals, redundant `'use strict'` removal), replaced stale `// eslint-disable-next-line` + `var` loop counter with `let`.

## Verification

- `bun run bench`: **11/11 tests pass** (5 validation + 6 benchmarks) on vitest 5.

## Metrics (measured on this machine, cold start)

| Operation | Before | After | Δ |
|---|---|---|---|
| lint + format check | `prettier -c .` **0.22s** | `biome check .` **0.09s** | **2.4x faster** (and now also lints) |
| markdown lint/format | none | `rumdl check .` 0.09s | new |
| install (cold) | 3.06s | 3.69s | +0.6s — adds biome/rumdl/lefthook as devDeps |
| git hooks | none | lefthook pre-commit auto-fix + markdown gate | new |

> Note: benchmark throughput numbers are engine-reported (tinybench) and not comparable before/after vitest majors; correctness is what is asserted here (all serializers validated, benchmarks complete).
