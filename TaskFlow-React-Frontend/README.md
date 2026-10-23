# TaskFlow – React Frontend

React + Vite frontend for TaskFlow, styled with neomorphism (light and dark).

## Run it

```bash
npm install
cp .env.example .env   # then edit VITE_API_URL, or leave it empty for demo mode
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Environment variables

| Name | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the FastAPI backend, e.g. `http://127.0.0.1:8000`. If empty, the app runs in **demo mode** with in-memory sample tasks that reset on refresh. |

Never put secrets in a `VITE_` variable; they are visible in the browser.

## Expected API

`GET /tasks`, `POST /tasks` (`{title, priority}`), `PATCH /tasks/{id}` (`{is_done}`), `DELETE /tasks/{id}`.
If the backend doesn't return `priority` yet, tasks are shown as `Medium`.
