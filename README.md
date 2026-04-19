# Issue Tracker — Backend API

A RESTful API built with **Express.js**, **MongoDB Atlas**, and **JWT authentication**, written entirely in **TypeScript**.

- **Live API:** [https://issuetracker.duckdns.org/api] (Check here - https://issuetracker.duckdns.org/health)*(deployed on AWS EC2)*
- **Repository:** [github.com/H-N-S-Abayawardhana/issue-tracker-api](https://github.com/H-N-S-Abayawardhana/issue-tracker-api)
- **Frontend:** [https://issuetrackapp.vercel.app](https://issuetrackapp.vercel.app)

---

## Tech Stack

| Layer      | Technology               |
|------------|--------------------------|
| Runtime    | Node.js                  |
| Framework  | Express.js               |
| Language   | TypeScript (strict mode) |
| Database   | MongoDB via Mongoose     |
| Auth       | JWT (`jsonwebtoken`)     |
| Hashing    | `bcryptjs`               |
| Validation | `express-validator`      |
| Dev runner | `tsx watch`              |

---

## Project Structure

```
backend/
└── src/
    ├── config/        # Database connection and JWT helpers
    ├── controllers/   # Route handlers and request validation rules
    ├── middleware/    # Auth guard, input validator, error handler
    ├── models/        # Mongoose schemas — User, Issue
    ├── routes/        # Express router definitions
    ├── services/      # Business logic and database queries
    └── utils/         # Shared response helpers and pagination
```

---

## Local Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/H-N-S-Abayawardhana/issue-tracker-api.git
cd issue-tracker-api
yarn
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/issue_tracker
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Run the development server

```bash
yarn dev
```

The API will be available at `http://localhost:5000`.

### 4. Build for production

```bash
yarn build
yarn start
```

---

## API Reference

All protected routes require a `Bearer` token in the `Authorization` header.

### Authentication

| Method | Endpoint             | Auth | Description          |
|--------|----------------------|------|----------------------|
| POST   | `/api/auth/register` | No   | Register a new user  |
| POST   | `/api/auth/login`    | No   | Login and get token  |
| GET    | `/api/auth/me`       | Yes  | Get current user     |

### Issues

| Method | Endpoint                    | Auth | Description                    |
|--------|-----------------------------|------|--------------------------------|
| GET    | `/api/issues`               | Yes  | List issues (filter + paginate)|
| POST   | `/api/issues`               | Yes  | Create a new issue             |
| GET    | `/api/issues/:id`           | Yes  | Get a single issue             |
| PUT    | `/api/issues/:id`           | Yes  | Update an issue                |
| PATCH  | `/api/issues/:id/status`    | Yes  | Update status only             |
| DELETE | `/api/issues/:id`           | Yes  | Delete an issue                |
| GET    | `/api/issues/stats/counts`  | Yes  | Get counts grouped by status   |
| GET    | `/api/issues/export/json`   | Yes  | Export issues as JSON file     |
| GET    | `/api/issues/export/csv`    | Yes  | Export issues as CSV file      |

### Users

| Method | Endpoint      | Auth | Description               |
|--------|---------------|------|---------------------------|
| GET    | `/api/users`  | Yes  | List all users (for assignee dropdown) |

### Query Parameters — `GET /api/issues`

| Parameter  | Type   | Example       | Description               |
|------------|--------|---------------|---------------------------|
| `page`     | number | `1`           | Page number               |
| `limit`    | number | `10`          | Items per page            |
| `search`   | string | `login bug`   | Full-text search on title |
| `status`   | string | `Open`        | Filter by status          |
| `priority` | string | `High`        | Filter by priority        |
| `severity` | string | `Major`       | Filter by severity        |

**Example:**
```
GET /api/issues?page=1&limit=10&search=login&status=Open&priority=High
```

---

## Code Quality

### TypeScript — Strict Mode

The entire codebase is written in TypeScript with `"strict": true` in `tsconfig.json`, which enables:

- `strictNullChecks` — no accidental `null` or `undefined` access
- `noImplicitAny` — every value must have an explicit or inferred type
- `strictFunctionTypes` — safer function signature checking
- `forceConsistentCasingInFileNames` — prevents import casing bugs across platforms

### ESLint

ESLint is configured with `@typescript-eslint` rules to catch common issues at the source level:

- `@typescript-eslint/no-explicit-any` — warns on use of `any` type
- `@typescript-eslint/no-unused-vars` — warns on unused variables (ignores `_`-prefixed params)
- `eslint-config-prettier` is applied last to disable any rules that conflict with Prettier formatting

Run the linter:

```bash
yarn lint
```

### Prettier

Consistent code formatting is enforced with Prettier across the entire `src/` directory:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

Format the codebase:

```bash
yarn format
```

### Architecture & Separation of Concerns

The project follows a layered architecture to keep responsibilities clearly separated:

| Layer       | Responsibility                                              |
|-------------|-------------------------------------------------------------|
| Routes      | Define URL paths and attach middleware chains               |
| Controllers | Parse requests, run validation rules, call the service layer|
| Services    | All business logic and direct database queries              |
| Models      | Mongoose schemas and type definitions                       |
| Middleware  | Cross-cutting concerns — auth guard, validator, error handler|
| Utils       | Stateless helpers — response formatter, pagination builder  |

This means controllers contain no business logic, and services contain no HTTP knowledge — each layer is independently testable and easy to maintain.

---

## Features Implemented

- **Full CRUD** — create, read, update, and delete issues
- **JWT Authentication** — register, login, and protected routes
- **Password hashing** — all passwords stored with `bcryptjs`
- **Input validation** — every route validates inputs with `express-validator`
- **Assignee support** — issues can be assigned to any registered user
- **Search** — MongoDB text index for fast title search
- **Filters** — filter by status, priority, and severity
- **Pagination** — server-side with total count and page metadata
- **Status counts** — aggregated counts by status for the dashboard
- **CSV / JSON export** — full filtered list download (capped at 5,000 rows)
- **Error handling** — centralised error middleware with consistent response format
- **CORS** — configured to allow requests from the frontend origin only
