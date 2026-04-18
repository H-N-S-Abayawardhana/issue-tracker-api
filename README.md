# Issue Tracker — Backend API

Express.js REST API with MongoDB Atlas and JWT authentication — written in 100% TypeScript.

## Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Runtime     | Node.js                     |
| Framework   | Express.js                  |
| Language    | TypeScript (strict mode)    |
| Database    | MongoDB via Mongoose        |
| Auth        | JWT (`jsonwebtoken`)        |
| Hashing     | `bcryptjs`                  |
| Validation  | `express-validator`         |
| Dev runner  | `tsx watch`                 |

## Project Structure

```
backend/
├── src/
│   ├── config/          # DB connection + JWT helpers
│   ├── models/          # Mongoose schemas (User, Issue)
│   ├── controllers/     # Request handlers + validation rules
│   ├── middleware/       # Auth guard, validation, error handler
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic + DB queries
│   ├── utils/           # Response + pagination helpers
├── tsconfig.json
├── .env.example
└── package.json
```

## Setup

### 1. Install dependencies

```bash
yarn
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/issue_tracker
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Start the server

```bash
# Development (TypeScript, auto-reload)
yarn dev

# Production build
yarn build
yarn start
```

API runs at `http://localhost:5000`.

## API Endpoints

### Auth

| Method | Route                | Protected | Description         |
|--------|----------------------|-----------|---------------------|
| POST   | `/api/auth/register` | No        | Create account       |
| POST   | `/api/auth/login`    | No        | Get JWT token        |
| GET    | `/api/auth/me`       | Yes       | Current user profile |

### Issues

| Method | Route                      | Description              |
|--------|----------------------------|--------------------------|
| GET    | `/api/issues`              | List with filters + pages |
| POST   | `/api/issues`              | Create issue              |
| GET    | `/api/issues/:id`          | Get single issue          |
| PUT    | `/api/issues/:id`          | Update issue              |
| PATCH  | `/api/issues/:id/status`   | Change status only        |
| DELETE | `/api/issues/:id`          | Delete issue              |
| GET    | `/api/issues/stats/counts` | Counts by status          |
| GET    | `/api/issues/export/json`  | Export as JSON            |
| GET    | `/api/issues/export/csv`   | Export as CSV             |

### Query params for `GET /api/issues`

`?page=1&limit=10&search=login&status=Open&priority=High&severity=Major`