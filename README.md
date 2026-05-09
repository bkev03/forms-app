# QuickForms

Full-stack survey editor and filler web application built with the MERN stack.

## Tech Stack

- **Backend:** Node.js, Express 5, Mongoose, MongoDB
- **Frontend:** React 18, Vite 5, React Router v6

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd forms-app
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see `backend/.env.example`):

```env
PORT=<port>
MONGODB_URL=<mongodb_connection_string>
JWT_SECRET=<jwt_secret>
CORS_ORIGIN=<frontend_url>
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` (see `frontend/.env.example`):

```env
VITE_API_URL=<backend_url>
```

## Running Locally

Both the backend and frontend need to run simultaneously in separate terminals.

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

The API server starts on the port defined in `backend/.env` (default: `5001`).

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

The Vite dev server starts on the URL shown in the terminal output. Open it in your browser.

## Building for Production

```bash
cd frontend
npm run build
```

The production-ready static files are output to `frontend/dist/`. Serve them with any static file server or configure Express to serve them.

## Roles

| Role | Capabilities |
|------|-------------|
| **Editor** | Create, edit, delete, and publish forms; view responses to own forms |
| **Filler** | Browse open forms, submit responses, view own submission history |

Both roles are self-selectable at signup. An editor only has elevated rights over their own forms.

## API Overview

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | /api/users/signup | — | Register; body: `{ username, email, password, role }` |
| POST | /api/users/login | — | Login; returns JWT token |
| GET | /api/users/profile | required | Returns current user |
| GET | /api/forms/ | — | List all open forms (paginated) |
| POST | /api/forms/ | editor | Create a new form |
| GET | /api/forms/:id | optional | View a single form |
| PUT | /api/forms/:id | editor | Update own form |
| DELETE | /api/forms/:id | editor | Delete own form (cascades to responses) |
| PATCH | /api/forms/:id/status | editor | Toggle `isOpen` |
| GET | /api/forms/my-forms | editor | List own forms (paginated) |
| POST | /api/responses/ | required | Submit a response (one per user per form) |
| GET | /api/responses/my-responses | required | List own submissions (paginated) |
| GET | /api/responses/:id | required | View a single response |
| GET | /api/responses/form/:formId | editor | List all responses to own form (paginated) |

Paginated endpoints accept `?page=1&limit=20` query parameters (max limit: 100).
