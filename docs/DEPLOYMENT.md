# Global Events Travels - Backend Deployment Guide

This document describes how to set up automated deployment of the FastAPI backend to a VPS using GitHub Actions.

---

## 1. Deployment Strategy

| Branch   | Environment | Trigger            |
|----------|-------------|--------------------|
| `develop` | Staging     | Automatic on push  |
| `main`    | Production  | Automatic on push  |

- **Push to `develop`** → Deploys to Staging (automatic)
- **Push to `main`** → Deploys to Production (automatic)
- **Manual run** → Go to Actions > Deploy Backend to VPS > Run workflow, then choose staging or production

---

## 2. Environments

| Environment | URL                                      | Port | Deploy Path                                                                 |
|-------------|------------------------------------------|------|-----------------------------------------------------------------------------|
| Staging     | https://staging.api.globaleventstravels.com | 8093 | `/home/globaleventstravels-staging-api/htdocs/staging.api.globaleventstravels.com` |
| Production  | https://api.globaleventstravels.com      | 8092 | `/home/globaleventstravels-api/htdocs/api.globaleventstravels.com`                 |

---

## 3. Required GitHub Secrets

### Repository-level Secrets

Configure these in **Settings > Secrets and variables > Actions**:

| Secret       | Description              | Example        |
|--------------|--------------------------|----------------|
| `SSH_HOST`   | VPS hostname or IP       | `82.29.161.183`|
| `SSH_USER`   | SSH username             | `root`         |
| `SSH_PASSWORD` | SSH password           | (your password)|
| `SSH_PORT`   | SSH port (optional)      | `22`           |

### Environment-specific Secrets

Create two environments: **staging** and **production** (Settings > Environments). For each, add:

| Secret   | Description                                           |
|----------|-------------------------------------------------------|
| `ENV_FILE` | Full contents of the `.env` file for that environment |

The `ENV_FILE` secret should contain all environment variables, one per line. Example:

```
DATABASE_URL=mysql+pymysql://user:pass@host:3306/dbname
STORAGE_TYPE=azure
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_CONTAINER_NAME=global-events-travels
LOCAL_UPLOAD_DIR=uploads
BREVO_API_KEY=...
ADMIN_EMAIL=...
SENDER_EMAIL=...
SENDER_NAME=Global Events Travels
FRONTEND_URL=https://globaleventstravels.com
API_BASE_URL=https://api.globaleventstravels.com
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://globaleventstravels.com
USE_ALEMBIC_MIGRATIONS=true
GOOGLE_MAPS_API_KEY=...
GOOGLE_REVIEWS_PLACE_ID=...
```

---

## 4. VPS Prerequisites

Before the first deployment, create the deploy directories on the VPS:

```bash
mkdir -p /home/globaleventstravels-staging-api/htdocs/staging.api.globaleventstravels.com
mkdir -p /home/globaleventstravels-api/htdocs/api.globaleventstravels.com
```

Ensure the VPS has:

- Python 3.11+
- SSH access enabled
- Ports 8092 and 8093 open (or your chosen ports)
- Reverse proxy (Nginx/Apache) configured to forward to these ports if using HTTPS

---

## 5. Optional: Alembic Migrations

The backend supports automatic database migrations on startup. Set in your `ENV_FILE`:

```
USE_ALEMBIC_MIGRATIONS=true
```

When enabled, the app runs `alembic upgrade head` on each restart. Use this only after verifying migrations locally.

---

## 6. Troubleshooting

### Check service status

```bash
# Staging
systemctl status globaleventstravels-staging-api

# Production
systemctl status globaleventstravels-api
```

### View logs

```bash
# Staging
journalctl -u globaleventstravels-staging-api -f

# Production
journalctl -u globaleventstravels-api -f
```

### Restart service manually

```bash
systemctl restart globaleventstravels-staging-api
# or
systemctl restart globaleventstravels-api
```

### Common issues

- **Service fails to start**: Check `journalctl -u <service> -n 50` for errors. Verify `.env` has correct `DATABASE_URL` and required keys.
- **Port in use**: The workflow kills any process on the port before restart. If conflicts persist, manually stop the old process.
- **Permission denied**: Ensure deploy directories are writable by the SSH user (typically root).
