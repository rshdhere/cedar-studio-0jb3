# cedar-studio-0jb3

A focused todo list built with Next.js.

## Getting started

```bash
bun install && bun run build && bun run start
```

For local development:

```bash
bun install && bun run dev
```

## Endpoints

- `GET /` — todo list UI
- `GET /health` — `{ "ok": true }`
- `GET/POST /api/todos` — list and create todos
- `PATCH/DELETE /api/todos/[id]` — update or remove a todo
