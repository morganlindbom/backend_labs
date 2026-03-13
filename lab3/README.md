# Lab 2 - Secure REST API with Express

This Lab2 project is an Express and MySQL API for `items` with MVC structure, API key protection, and JWT-based login.

## Tech

- Node.js with ES modules
- Express
- MySQL with `mysql2`
- Helmet for secure HTTP headers
- `bcrypt` for password hashing
- `jsonwebtoken` for JWT authentication

## Start

```bash
cd lab2
npm install
npm start
```

The server runs at `http://localhost:3000`.

## Environment variables

The server reads these values from `.env`:

```text
API_KEY=hkr-lab2-key
JWT_SECRET=lab2-super-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=labs
```

An `.env.example` file is included as a reference, and `.env` is ignored by git.

## Security configuration

- Helmet is enabled
- `x-powered-by` is disabled
- Dependencies were updated with `npm update`
- `npm audit` reports 0 vulnerabilities

## User login

The application contains a hard-coded user:

- Username: `doe`
- Password: `doe`

The password is stored as a bcrypt hash and the login route returns a JWT token.

## Routes

Base URL: `/api/items`

All routes below require a JWT token except `POST /api/items/login`.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/items` | Get all items |
| GET | `/api/items/:id` | Get one item by id |
| POST | `/api/items` | Create a new item |
| PUT | `/api/items/:id` | Update an item |
| DELETE | `/api/items/:id` | Delete an item |
| GET | `/api/items/status/:status` | Filter items by status |
| GET | `/api/items/search/:title` | Search items by title |
| POST | `/api/items/login` | Login and receive JWT |
| GET | `/api/items/secure/api-key` | Protected by API key |
| GET | `/api/items/secure/jwt` | Protected by JWT |

## Testing API key

Valid API key value in `.env`:

```text
API_KEY=hkr-lab2-key
```

Use query string:

```text
GET http://localhost:3000/api/items/secure/api-key?apiKey=hkr-lab2-key
```

Or use header:

```text
x-api-key: hkr-lab2-key
```

Invalid or missing API key returns `401 Unauthorized`.

## Testing JWT

Login request:

```http
POST /api/items/login
Content-Type: application/json

{
  "username": "doe",
  "password": "doe"
}
```

Example success response:

```json
{
  "token": "<jwt-token>"
}
```

Use the token in the header:

```text
Authorization: Bearer <jwt-token>
```

Protected route:

```text
GET http://localhost:3000/api/items/secure/jwt
```

Invalid or missing token returns `401 Unauthorized`.
