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

