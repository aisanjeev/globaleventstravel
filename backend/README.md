# Global Events Travels - Backend API

FastAPI backend for the Global Events Travels website.

## Features

- **FastAPI** - Modern, fast Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type hints
- **SQLite/MySQL** - Configurable database support
- **Poetry** - Dependency management
- **JWT Authentication** - Secure token-based auth with role-based access
- **Alembic** - Database migrations (optional)

## Quick Start

### 1. Install Poetry (if not installed)

```bash
pip install poetry
```

### 2. Install Dependencies

```bash
cd backend
poetry install
```

### 3. Configure Environment

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Default configuration uses SQLite. For MySQL, update `DATABASE_URL`:

```env
# SQLite (default)
DATABASE_URL=sqlite:///./data/app.db

# MySQL
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/globaleventstravels
```

### 4. Seed Database

```bash
poetry run python -m app.db.seed
```

### 5. Run Development Server

```bash
poetry run uvicorn app.main:app --reload --port 8000
```

Or using the script shortcut:

```bash
poetry run python run.py
```

## API Documentation

Once running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/api/v1/openapi.json

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login with email/password (returns JWT token)
- `POST /api/v1/auth/login/json` - Login with JSON body
- `POST /api/v1/auth/register` - Register new user
- `GET /api/v1/auth/me` - Get current user profile (protected)
- `PUT /api/v1/auth/me` - Update current user profile (protected)
- `POST /api/v1/auth/me/change-password` - Change password (protected)
- `POST /api/v1/auth/refresh` - Refresh JWT token (protected)
- `GET /api/v1/auth/users` - List all users (admin only)
- `GET /api/v1/auth/users/{id}` - Get user by ID (admin only)
- `PUT /api/v1/auth/users/{id}` - Update user (admin only)
- `POST /api/v1/auth/users/{id}/deactivate` - Deactivate user (admin only)
- `POST /api/v1/auth/users/{id}/activate` - Activate user (admin only)

### Treks
- `GET /api/v1/treks` - List all treks (with filters)
- `GET /api/v1/treks/featured` - Get featured treks
- `GET /api/v1/treks/{slug}` - Get trek by slug
- `POST /api/v1/treks` - Create trek
- `PUT /api/v1/treks/{id}` - Update trek
- `DELETE /api/v1/treks/{id}` - Delete trek

### Expeditions
- `GET /api/v1/expeditions` - List all expeditions
- `GET /api/v1/expeditions/featured` - Get featured expeditions
- `GET /api/v1/expeditions/{slug}` - Get expedition by slug

### Leads
- `POST /api/v1/leads` - Create lead (from forms)
- `GET /api/v1/leads` - List all leads
- `GET /api/v1/leads/new` - Get new/uncontacted leads

### Contacts
- `POST /api/v1/contacts` - Submit contact form
- `GET /api/v1/contacts` - List contact messages

### Testimonials
- `GET /api/v1/testimonials` - List testimonials
- `GET /api/v1/testimonials/featured` - Get featured testimonials

### Blog
- `GET /api/v1/blog/posts` - List blog posts
- `GET /api/v1/blog/posts/featured` - Get featured posts
- `GET /api/v1/blog/posts/{slug}` - Get post by slug

### Other
- `GET /api/v1/guides` - List guides
- `GET /api/v1/offices` - List offices
- `GET /api/v1/bookings` - List bookings
- `GET /api/v1/health` - Health check

## Project Structure

```
backend/
├── alembic/                   # Alembic migration files
│   ├── versions/              # Migration scripts
│   ├── env.py                 # Alembic environment config
│   └── script.py.mako         # Migration template
├── alembic.ini                # Alembic configuration
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/      # API route handlers
│   │       └── router.py       # API router
│   ├── core/
│   │   ├── config.py          # Settings
│   │   └── deps.py            # Dependencies
│   ├── crud/                  # CRUD operations
│   ├── db/
│   │   ├── models/            # SQLAlchemy models
│   │   ├── base.py            # Base model
│   │   ├── session.py         # Database session
│   │   └── seed.py            # Data seeding
│   ├── models/                # Pydantic schemas
│   └── main.py               # FastAPI app
├── data/                      # SQLite database (created automatically)
├── requirements.txt
├── run.py
└── README.md
```

## Database Configuration

### SQLite (Default)
No additional configuration needed. Database file is created at `data/app.db`.

### MySQL
1. Create database:
   ```sql
   CREATE DATABASE globaleventstravels CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Update `.env`:
   ```env
   DATABASE_URL=mysql+pymysql://user:password@localhost:3306/globaleventstravels
   ```

3. Run seeder to initialize tables and data.

## Database Migrations with Alembic

The project includes Alembic for database schema version control. By default, the application uses `create_all()` for backward compatibility. You can optionally enable Alembic migrations.

### Initial Setup

Alembic is already configured. The migration files are located in `alembic/versions/`.

### Using Alembic Migrations

#### Option 1: Manual Migration Management (Recommended)

1. **Generate a new migration** after making model changes:
   ```bash
   cd backend
   poetry run alembic revision --autogenerate -m "Description of changes"
   ```

2. **Review the generated migration** in `alembic/versions/` before applying.

3. **Apply migrations**:
   ```bash
   poetry run alembic upgrade head
   ```

4. **Rollback a migration** (if needed):
   ```bash
   poetry run alembic downgrade -1
   ```

5. **Check current migration status**:
   ```bash
   poetry run alembic current
   ```

6. **View migration history**:
   ```bash
   poetry run alembic history
   ```

#### Option 2: Automatic Migrations on Startup

To enable automatic migrations when the application starts:

1. Add to your `.env` file:
   ```env
   USE_ALEMBIC_MIGRATIONS=true
   ```

2. The application will automatically run `alembic upgrade head` on startup.

**Note:** If Alembic fails, the application will fall back to `create_all()` to ensure the application still starts.

### Migration Workflow

1. **Make changes** to your SQLAlchemy models in `app/db/models/`
2. **Generate migration**: `alembic revision --autogenerate -m "description"`
3. **Review** the generated migration file in `alembic/versions/`
4. **Edit** the migration if needed (e.g., data migrations, custom SQL)
5. **Apply migration**: `alembic upgrade head`
6. **Test** your changes

### Important Notes

- **Backward Compatibility**: The default behavior uses `create_all()` and remains unchanged unless you set `USE_ALEMBIC_MIGRATIONS=true`
- **Database Support**: Alembic works with both SQLite and MySQL
- **Initial Migration**: An initial migration has been created that captures the current schema state
- **Production**: Always review and test migrations before applying in production

### Migration Commands Reference

```bash
# Create a new migration (auto-generate from model changes)
alembic revision --autogenerate -m "message"

# Create an empty migration (for manual SQL)
alembic revision -m "message"

# Apply all pending migrations
alembic upgrade head

# Apply migrations up to a specific revision
alembic upgrade <revision_id>

# Rollback one migration
alembic downgrade -1

# Rollback to a specific revision
alembic downgrade <revision_id>

# Show current revision
alembic current

# Show migration history
alembic history

# Show pending migrations
alembic heads
```

## Authentication

### Default Admin User
After running the seed script, a default admin user is created:
- **Email:** `admin@globaleventstravels.com`
- **Password:** `admin123`

⚠️ **Important:** Change this password in production!

### Using JWT Tokens
1. Login to get a token:
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@globaleventstravels.com&password=admin123"
```

2. Use the token in subsequent requests:
```bash
curl "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### User Roles
- **user** - Regular user (can access their profile)
- **admin** - Admin user (can manage users and content)
- **superadmin** - Full access (cannot be deactivated)

## CORS Configuration

Configure allowed origins in `.env`:

```env
CORS_ORIGINS=http://localhost:4321,http://localhost:3000,https://yourdomain.com
```

## Development

### Run Tests

```bash
pytest
```

### Code Formatting

```bash
black app/
isort app/
```

### Linting

```bash
flake8 app/
```

