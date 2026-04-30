# RxSignal — Codebase Guide

AI-powered FDA adverse drug event explorer. Search any drug name → fetch 20 reports from openFDA → generate a plain-English clinical analysis via Groq → display in a dark-themed React UI.

## Tech stack

| Layer    | Technology                                                    |
| -------- | ------------------------------------------------------------- |
| Backend  | Python 3.11 · Django 4.2 · Django REST Framework              |
| Frontend | React 18 · Vite 5 · Tailwind CSS 3                            |
| AI       | Groq API · `llama-3.1-8b-instant` (`groq` Python package)     |
| Data     | openFDA Drug Event API — no API key required                  |
| Prod     | gunicorn · whitenoise · Railway (`Procfile` + `railway.json`) |

## Project structure

```
rx-signal/
├── backend/
│   ├── .env                   # local secrets (gitignored)
│   ├── .venv/                 # Python virtualenv (gitignored)
│   ├── requirements.txt
│   ├── manage.py
│   ├── rxsignal/              # Django project
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── api/                   # single Django app
│       ├── views.py           # all backend logic lives here
│       └── urls.py
└── frontend/
    ├── src/
    │   ├── App.jsx             # state, layout, search handler
    │   ├── index.css           # Tailwind directives + global styles
    │   └── components/
    │       ├── Header.jsx
    │       ├── SearchBar.jsx
    │       ├── EventCard.jsx   # individual adverse event card
    │       ├── AiAnalysis.jsx  # Groq summary panel + markdown renderer
    │       └── EmptyState.jsx
    ├── tailwind.config.js      # custom color tokens (surface, border, accent, etc.)
    └── vite.config.js          # proxies /api/* → localhost:8000 in dev
```

## Running locally

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# create backend/.env with GROQ_API_KEY=... (see .env.example)
python manage.py runserver          # → http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                         # → http://localhost:5173
```

Vite proxies `/api/*` to `localhost:8000` automatically — no CORS config needed in dev.

### Test the API directly

```
GET http://localhost:8000/api/events/?drug=aspirin
```

## Important codebase context

**No database.** Django is configured without any database or auth app. `INSTALLED_APPS` omits `django.contrib.auth`, so DRF is configured with `UNAUTHENTICATED_USER = None` and empty auth/permission classes. Don't add models without also adding `django.contrib.auth` and running migrations.

**All backend logic is in one file.** `api/views.py` contains the openFDA fetch (`_fetch_fda_events`), data parsing (`_parse_event`), prompt construction (`_build_analysis_prompt`), Groq call (`_call_groq`), and the DRF view (`AdverseEventsView`). It's intentionally flat — no serializers, no models.

**`load_dotenv` requires an explicit path.** `settings.py` calls `load_dotenv(BASE_DIR / ".env")`. A bare `load_dotenv()` resolves relative to CWD, which is unreliable depending on how the server is started. Keep the explicit path.

**Tailwind uses custom design tokens.** Colors like `bg-surface-2`, `text-text-secondary`, `border-border-subtle`, and `text-accent-purple` are defined in `tailwind.config.js` — not standard Tailwind classes. Check there before adding new UI.

**Inline markdown renderer.** `AiAnalysis.jsx` includes a small custom markdown parser (`MarkdownRenderer` + `inlineMarkdown`) that handles the `**Heading**` / bullet / inline bold structure that Groq returns. It is not a general-purpose markdown renderer — it's tuned to the prompt's output format.

**AI provider.** Uses Groq (llama-3.1-8b-instant). Groq was selected for its generous free tier and fast inference — no billing setup required for local dev or demo use.

## Environment variables

| Variable               | Required | Where used                              |
| ---------------------- | -------- | --------------------------------------- |
| `GROQ_API_KEY`         | Yes      | `rxsignal/settings.py` → `api/views.py` |
| `DJANGO_SECRET_KEY`    | No       | Defaults to an insecure dev value       |
| `DEBUG`                | No       | Defaults to `True`                      |
| `ALLOWED_HOSTS`        | No       | Comma-separated; defaults to localhost  |
| `CORS_ALLOWED_ORIGINS` | No       | Comma-separated; used in production     |
