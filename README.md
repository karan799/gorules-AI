# GoRules Decision Editor

Custom decision editor with Ant Design UI and Zen Engine on Express.

## Structure

```
backend/          Node.js + Express API (Zen Engine)
frontend/         React + Vite + Ant Design editor
shared/jdm/       JDM types, Zod schemas, graph utilities
```

## Development

```bash
npm install
npm run dev
```

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:5173    |
| Backend  | http://localhost:3001    |

## Scripts

| Command            | Description              |
|--------------------|--------------------------|
| `npm run dev`      | Start backend + frontend |
| `npm run dev:backend`  | API only             |
| `npm run dev:frontend` | Web only             |
| `npm run build`    | Build all workspaces     |

## API

- `POST /api/v1/simulate` — evaluate with trace
- `POST /api/v1/evaluate` — evaluate
- `POST /api/v1/validate/graph` — validate JDM
- `GET /api/v1/health` — health check
