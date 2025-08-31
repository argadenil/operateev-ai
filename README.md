# operateev-ai

Monorepo containing a Go backend API and a Next.js frontend UI.

## Stack
- **Backend**: Go (module in `backend/`) – HTTP API (controllers, routes, middleware, models, utils). Entry: `backend/main.go`.
- **Frontend**: Next.js / React (App Router) in `frontend/`.

## Repository Layout
```
backend/        Go API service
frontend/       Next.js web app
```

## Quick Start
### Prerequisites
- Go 1.22+ (check with `go version`)
- Node.js 18+ & pnpm/npm/yarn (choose one)

### Backend
```bash
cd backend
# tidy & download deps
go mod tidy
# run
go run ./...
```
Service will start on default port (set in `main.go` or env). Create a `.env` (if needed) for DB keys, API keys, etc.

Suggested env vars:
```
PORT=8080
DB_URL=postgres://user:pass@host:5432/dbname?sslmode=disable
```

### Frontend
```bash
cd frontend
npm install   # or pnpm install / yarn
npm run dev   # starts Next.js dev server
```
Visit: http://localhost:3000

## Development Notes
- Commit to feature branches off `main-dev-p1`, open PRs before merging.
- Keep backend and frontend changes in separate commits when possible.
- Add/update README sections when introducing new services or scripts.

## Testing (Add As Implemented)
Backend: add Go tests under `backend/**_test.go` then run `go test ./...`.
Frontend: add tests (e.g. Vitest / Jest) once configured.

## Coding Guidelines
- Go: idiomatic, run `go fmt ./...` before commit.
- TS/JS: follow ESLint config in `frontend/` (run `npm run lint`).

## Git Ignore Highlights
- Backend ignores `tml/` (temporary local workspace directory).

## Contributing
1. Fork / branch
2. Implement + tests
3. Update docs
4. PR with concise description

## Future Enhancements
- Containerization (Dockerfiles for backend & frontend)
- CI pipeline (lint, test, build)
- Centralized env management

## License
Add license information here (e.g., MIT) if applicable.
