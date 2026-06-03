# Branching strategy

## Main integration branch

| Branch | Purpose |
|--------|---------|
| **`main`** | Fully integrated editor — all phases merged and working together |

```bash
git checkout main
npm install
npm run dev
```

## Phase branches (isolated milestones)

Each phase branch contains **only work up to that phase**. Use them for focused review or learning the incremental build.

| Branch | Phase | Includes |
|--------|-------|----------|
| `phase/1-decision-table` | Spreadsheet decision table inspector | Base app + table editor |
| `phase/2-inspectors` | Expression, Function (Monaco), Switch | Phase 1 + node inspectors |
| `phase/3-trace-overlay` | Simulation trace on graph | Phase 2 + trace highlighting |
| `phase/4-zen-wasm` | Browser WASM for expressions | Phase 3 + zen-engine-wasm + CodeMirror |

## Workflow

```bash
# Work on a single phase in isolation
git checkout phase/2-inspectors
npm install
npm run dev

# Return to full product
git checkout main
```

## Merging phases into main

Phases were developed sequentially and integrated on `main`. To add a new phase:

```bash
git checkout -b phase/5-my-feature main
# ... implement ...
git checkout main
git merge phase/5-my-feature
```

## Commit convention

- `feat(scope):` — new capability
- `fix(scope):` — bug fix
- `chore:` — tooling, deps, docs
