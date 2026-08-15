# cedar-studio-0jb3

A focused todo list built with Next.js.

## Getting started

```bash
npm install && npm run build && npm run start
```

For local development:

```bash
npm install && npm run dev
```

## Endpoints

- `GET /` — todo list UI
- `GET /health` — `{ "ok": true }`
- `GET/POST /api/todos` — list and create todos
- `PATCH/DELETE /api/todos/[id]` — update or remove a todo
