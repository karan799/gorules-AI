# Branching strategy

## Main integration branch

| Branch | Purpose |
|--------|---------|
| **`main`** | Fully integrated editor — all phases complete and working |

```bash
git checkout main
npm install
npm run dev
```

## Phase milestone branches (frozen snapshots)

Historical checkpoints for review. **New work merges into `main` only.**

| Branch | Milestone |
|--------|-----------|
| `phase/1-decision-table` | Initial spreadsheet table |
| `phase/2-inspectors` | Expression / Switch / Monaco Function |
| `phase/3-trace-overlay` | Graph trace highlighting |
| `phase/4-zen-wasm` | WASM load + CodeMirror |

Completion tags (optional): `v0.1-phase1-complete` … on `main` after polish merges.

## Completing a new phase (workflow)

```bash
git checkout main
git pull origin main
git checkout -b feature/phase-N-polish
# implement, commit, push
git checkout main
git merge feature/phase-N-polish
git push origin main
```

## Commit convention

- `feat(frontend):` — new capability
- `fix(frontend):` — bug fix
- `docs:` — documentation
