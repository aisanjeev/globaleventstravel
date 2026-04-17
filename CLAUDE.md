# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Full-stack travel/trekking platform for Global Events Travels with three sub-projects:
- `frontend/` — Public-facing Astro SSR site
- `backend/` — FastAPI REST API
- `admin/` — Next.js 14 admin dashboard

## Development Commands

### Frontend (Astro)
```bash
cd frontend
npm install
npm run dev        # http://localhost:4321
npm run build
npm run check      # TypeScript type checking
```

### Backend (FastAPI + Poetry)
```bash
cd backend
poetry install
poetry run start   # http://localhost:8000 (with --reload)
poetry run seed    # Seed database with initial data
pytest             # Run all tests
pytest tests/path/test_file.py::test_name  # Single test
black app/ && isort app/  # Format code
flake8 app/        # Lint
```

### Admin (Next.js)
```bash
cd admin
npm install
npm run dev        # http://localhost:3001
npm run lint
npm run build
```

## Architecture

### Backend (FastAPI)
- **Layered architecture**: `api/v1/endpoints/` → `crud/` → `db/models/` with `services/` for business logic
- `app/core/config.py` — Pydantic settings loaded from `.env`
- `app/core/security.py` — JWT token creation/verification
- `app/api/v1/router.py` — Aggregates all endpoint modules
- `app/db/session.py` — Async SQLAlchemy sessions
- All endpoints use `async/await`; database sessions injected via `Depends(get_db)`
- SQLite in development, MySQL in production (controlled by `DATABASE_URL`)
- Alembic migrations are optional — toggle with `USE_ALEMBIC_MIGRATIONS` env var; default uses `create_all()`

### Frontend (Astro)
- **Island architecture**: interactive UI uses React components with `client:load`
- File-based routing under `src/pages/`
- `src/lib/api.ts` — Typed fetch wrapper for all backend calls
- `src/lib/types.ts` — All TypeScript interfaces (Trek, Expedition, Guide, etc.)
- Path aliases: `@/*`, `@components/*`, `@layouts/*` configured in tsconfig
- Deployed via Vercel adapter (`@astrojs/vercel`)

### Admin (Next.js 14)
- App Router with route groups: `(auth)/` for login, `(dashboard)/dashboard/` for protected routes
- `src/services/api-client.ts` — Axios client with auth interceptors pointed at backend
- `src/store/` — Zustand for auth and UI state
- Forms use React Hook Form + Zod validation
- Tiptap for rich text editing (blog posts, page content)

## Environment Variables

**Backend** (`backend/.env`):
```
DATABASE_URL=mysql+pymysql://user:pass@host:3306/db   # or sqlite:///./data/app.db for dev
LOCAL_UPLOAD_DIR=uploads
STORAGE_TYPE=local                    # or "azure"
AZURE_STORAGE_CONNECTION_STRING=...
CONTAINER_NAME=global-events-travels
BREVO_API_KEY=...
ADMIN_EMAIL=...
SENDER_EMAIL=...
FRONTEND_URL=http://localhost:4321
GOOGLE_MAPS_API_KEY=...
GOOGLE_REVIEWS_PLACE_ID=...
```

**Frontend** (`frontend/.env`):
```
PUBLIC_API_BASE_URL=http://localhost:8000
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_GOOGLE_MAPS_API_KEY=...
```

**Admin** (`admin/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

- CI/CD via `.github/workflows/deploy-backend.yml`
- `develop` branch → staging (`staging.api.globaleventstravels.com:8093`)
- `main` branch → production (`api.globaleventstravels.com:8092`)
- Backend runs as a systemd service on a VPS
- Frontend deploys to Vercel

## Key Conventions

**Python (backend)**:
- `snake_case` for files/functions, `PascalCase` for classes
- Full type annotations; line length 100 chars (black config)
- Pydantic schemas in `app/models/`, SQLAlchemy models in `app/db/models/`

**TypeScript (frontend/admin)**:
- `PascalCase` for components, `camelCase` for utilities
- Typed props interfaces for all components
- Astro components use `Astro.props`; React components use typed props

**Database**:
- All models have `created_at` and `updated_at` timestamps
- Relationships use `relationship()` with cascade delete where appropriate
