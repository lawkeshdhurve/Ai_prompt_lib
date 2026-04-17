# AI Prompt Library

A full-stack application for managing AI Image Generation Prompts.

## Stack
- **Frontend**: Angular 17 (standalone components, reactive forms)
- **Backend**: Django 4.2 (class-based views, no DRF)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7 (view counter — source of truth)
- **Infra**: Docker + Docker Compose + Nginx

---

## Project Structure

```
ai-prompt-library/
├── backend/
│   ├── core/               # Django project (settings, urls, wsgi)
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── prompts/            # Prompts app
│   │   ├── models.py       # Prompt model (UUID pk)
│   │   ├── views.py        # List, Create, Detail views + Redis
│   │   └── urls.py
│   ├── requirements.txt
│   ├── manage.py
│   └── Dockerfile
├── frontend/
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── prompt-list/    # List view — title + complexity bars
│   │   │   ├── prompt-detail/  # Detail view — content + live view_count
│   │   │   └── add-prompt/     # Reactive form with validation
│   │   ├── services/
│   │   │   └── prompt.service.ts
│   │   ├── models/
│   │   │   └── prompt.model.ts
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   └── app.component.ts/html
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml
```

---

## Quick Start (Docker — Recommended)

```bash
# Clone / enter project
cd ai-prompt-library

# Build and start all services
docker compose up --build

# App is live at:
#   Frontend → http://localhost:4200
#   Backend API → http://localhost:8000
```

---

## Local Development (without Docker)

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables (or create a .env)
export POSTGRES_HOST=localhost
export POSTGRES_DB=promptsdb
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
export REDIS_HOST=localhost

# Run migrations
python manage.py migrate

# Start dev server
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start Angular dev server
npm start
# → http://localhost:4200
```

> **Note**: For local dev, the Angular service calls `http://localhost:8000`. Make sure the backend is running on port 8000.

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/prompts/` | List all prompts |
| `POST` | `/prompts/` | Create a new prompt |
| `GET` | `/prompts/:id/` | Get single prompt + increment Redis view count |

### POST /prompts/ — Request Body
```json
{
  "title": "Cyberpunk City",
  "content": "A neon-lit dystopian megacity at midnight, rain-slicked streets...",
  "complexity": 7
}
```

### GET /prompts/:id/ — Response (includes Redis view count)
```json
{
  "id": "3f9a...",
  "title": "Cyberpunk City",
  "content": "...",
  "complexity": 7,
  "created_at": "2024-01-15T10:30:00Z",
  "view_count": 12
}
```

---

## Architecture Notes

### Redis View Counter
- On every `GET /prompts/:id/`, Django calls `redis.incr(f"prompt:views:{id}")`
- Redis is the **sole source of truth** for view counts (not stored in PostgreSQL)
- `view_count` is always returned in the detail response

### Angular Reactive Form Validation
- **Title**: `required`, `minLength(3)`
- **Content**: `required`, `minLength(20)`
- **Complexity**: `required`, `min(1)`, `max(10)` — slider input
- Errors shown only after field is touched/dirty
- On success: toast notification → auto-redirect to detail view


<img width="1912" height="975" alt="Screenshot 2026-04-17 101157" src="https://github.com/user-attachments/assets/bc29c401-fe3b-4f68-ad21-3931e1360918" />

<img width="1917" height="969" alt="image" src="https://github.com/user-attachments/assets/bfef9476-8a17-4101-94ee-c8b3c0a4ebf9" />

### Django (no DRF)
- Pure Django `View` classes with `JsonResponse`
- CSRF disabled on API views via `@csrf_exempt` (appropriate for API-only endpoints)
- Input validation handled manually in `views.py`
