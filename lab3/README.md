# Lab 2 – REST API with Authentication

A REST API built with Node.js and Express for managing tasks. Lab 2 extends Lab 1 by adding two security layers on top of the existing CRUD API:

- **API Key** – required for all `/api/tasks` requests (sent in the `x-api-key` header)
- **JWT** – issued via `/auth/login` and required for protected routes such as `/api/protected`

## Technologies

| Technology        | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| Node.js           | JavaScript runtime                             |
| Express           | HTTP routing and middleware framework          |
| ES Modules        | `"type": "module"` – native import/export syntax |
| Helmet            | Sets secure HTTP response headers automatically |
| jsonwebtoken      | Signs and verifies JWT tokens                  |

---

## Project Structure

```
lab2/
├── server.js                    # Entry point – creates and starts the Express server
├── package.json
├── routes/
│   ├── tasks.routes.js          # Route definitions for /api/tasks
│   └── auth.routes.js           # Route definitions for /auth
├── controllers/
│   ├── tasks.controller.js      # HTTP logic for task operations
│   └── auth.controller.js       # Login logic and JWT issuance
├── middleware/
│   ├── apiKey.middleware.js      # Validates the x-api-key header
│   └── auth.middleware.js        # Validates JWT Bearer tokens
├── models/
│   └── tasks.model.js           # Data operations (read, create, update, delete)
└── data/
    └── tasks.data.js            # In-memory data source
```

---

## Getting Started

### Prerequisites

- Node.js version 18 or later

### Install and run

```bash
cd lab2
npm install
npm run dev
```

The server starts at `http://localhost:3000`.

---

## Authentication

### Layer 1 – API Key

All requests to `/api/tasks` require the following header:

```
x-api-key: secret-api-key-1234
```

Requests without a valid key receive `401 Unauthorized`.

### Layer 2 – JWT

Protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained by logging in via `POST /auth/login`. A missing or invalid token returns `403 Forbidden`.

### Login credentials (hardcoded for demo purposes)

| Field      | Value      |
| ---------- | ---------- |
| `username` | `admin`    |
| `password` | `password` |

---

## API Endpoints

Base URL: `http://localhost:3000`

### Auth

| Method | Endpoint       | Auth required | Description                   |
| ------ | -------------- | ------------- | ----------------------------- |
| `POST` | `/auth/login`  | None          | Log in and receive a JWT token |

### Tasks

| Method   | Endpoint          | Auth required | Description              |
| -------- | ----------------- | ------------- | ------------------------ |
| `GET`    | `/api/tasks`      | API Key       | Get all tasks            |
| `GET`    | `/api/tasks/:id`  | API Key       | Get a single task by id  |
| `POST`   | `/api/tasks`      | API Key       | Create a new task        |
| `PUT`    | `/api/tasks/:id`  | API Key       | Update an existing task  |
| `DELETE` | `/api/tasks/:id`  | API Key       | Delete a task            |

### Protected route

| Method | Endpoint          | Auth required | Description                        |
| ------ | ----------------- | ------------- | ---------------------------------- |
| `GET`  | `/api/protected`  | JWT token     | Example route protected by JWT     |

---

## Data Model

```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false
}
```

The `title` field is required when creating a task. `completed` is optional and defaults to `false` if omitted.

---

## Example Requests

### Login and receive a token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Access the protected route

Replace `TOKEN` with the value from the login response:

```bash
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer TOKEN"
```

### Get all tasks

```bash
curl http://localhost:3000/api/tasks \
  -H "x-api-key: secret-api-key-1234"
```

### Create a task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret-api-key-1234" \
  -d '{"title":"Study for exam","completed":false}'
```

### Update a task

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret-api-key-1234" \
  -d '{"title":"Buy groceries","completed":true}'
```

### Delete a task

```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "x-api-key: secret-api-key-1234"
```

> **Windows / PowerShell note:** Use `curl.exe` instead of `curl` to avoid the PowerShell alias. Replace single quotes with double quotes and escape inner quotes with `\"`.

---

## Error Handling

| Status code        | When it occurs                                     |
| ------------------ | -------------------------------------------------- |
| `200 OK`           | Successful GET or PUT                              |
| `201 Created`      | New resource created via POST                      |
| `400 Bad Request`  | Missing or invalid field in the request body       |
| `401 Unauthorized` | Missing or invalid API key                         |
| `403 Forbidden`    | Missing or invalid JWT token                       |
| `404 Not Found`    | No resource found with the given id                |

---

## Notes

- Tasks are stored **in memory**. All data is lost when the server restarts.
- Credentials and keys are hardcoded for demonstration purposes. In a real application these would be stored in environment variables and a database.
