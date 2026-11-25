# Contributing

Thank you for your interest in improving DHTMLX Gantt!

This file is for people who change the library code in this repository. If you only use the library in your own project, see [AGENTS.md](AGENTS.md) and [README.md](README.md).

## How this repository is maintained

This repository is **generated from an internal source tree** on every release. The content of each release replaces the previous content wholesale — pull requests cannot be merged here directly. Because of this, structural refactors should stay minimal and focused.

That said, contributions are welcome and are handled like this:

1. You open a pull request (or an issue) in this repository.
2. We review it. Accepted changes are applied to the internal source tree by the maintainers.
3. The change ships with the next release of this repository, and the PR is closed with a reference to the release. Contributors are credited in the changelog.

Small, focused PRs with a clear description and a test (or a reproducible sample) have the best chance of quick acceptance.

## Reporting bugs

Please include:

- a minimal reproducible snippet (or a modified sample from `samples/`),
- the expected and the actual behavior,
- browser and OS.

## Development

### Repository layout

| Path | Content |
|---|---|
| `src/dhtmlxgantt.ts` | library entry point |
| `src/core/` | core: datastores, task data layer, UI (grid, timeline, lightbox), worktime |
| `src/core/plugins/` | always-on plugins (batch update, task types, formatters…) |
| `src/ext/` | opt-in extensions activated via `gantt.plugins({...})` (tooltip, quick_info, keyboard_navigation…) |
| `src/css/` | LESS styles, fonts, skins |
| `src/locale/` | locales |
| `samples/` | runnable demos; served by `npm run start`, and the corpus the smoke test loads |
| `scripts/` | build/dev/test node scripts, sample-data backend |
| `codebase/` | build output (generated; never edit by hand) |

### Commands

```bash
npm install
npm run build          # vite build -> codebase/ + d.ts
npm run start          # watch build + backend (:9200) + vite devserver
npm run test           # build + smoke test: every sample loads without console errors
npm run test 07_grid   # smoke just one samples folder
npm run lint           # eslint over src/ (flat config, intentionally lax)
```

`npm run test` is a smoke pass: it builds the library, then loads every sample headless and fails on a page error or `console.error`. Run it before opening a PR — a red result means your change broke a sample.

### Working on the code

- The build must stay green: run `npm run build` after any `src/` change, and `npm run lint` should pass.
- Sample pages reference `../../codebase/dhtmlxgantt.js` — run a build before opening them.
- `src/types.d.ts` declares the compile-time globals (`VERSION`, `LICENSE`, …) injected by vite `define`.
- Some modules are intentional basic implementations of Pro features (e.g. `src/core/ui/render/dummy_layer.js`, re-export shims like `src/core/ui/grid/resource_grid.js`, and `src/core/worktime/strategy/no_work_time.ts`, the disabled (all-time-is-working) strategy that the calendar manager uses for every calendar — working-time calendars are out of scope). Do not "complete" them — the Pro feature set is out of scope for this edition (see Scope below).

### Conventions

- Match the style of the file you edit (the codebase mixes older ES5-style JS and newer TS — both are fine in their places).
- Tabs for indentation.
- No new runtime dependencies — the library bundle must stay dependency-free.

## Scope

This edition intentionally excludes the Pro-only features (auto scheduling, critical path, resources, baselines, split tasks, and others) as well as some features kept out of this community build (markers, multiselect, undo/redo, unscheduled tasks, the new-task placeholder) — see README. PRs that re-implement out-of-scope features will be declined.
