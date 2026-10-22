# Loan Products Admin Panel — Backend

A REST API for managing loan products, applicants, and automatic loan eligibility evaluation.

## Features

- JWT-based authentication
- Admin and Viewer role-based authorization
- Create, view, and update loan products
- Create, view, and update applicants
- Automatic eligibility evaluation
- Automatic re-evaluation when products are created or their criteria change
- Eligible product listing for each applicant
- Input validation and centralized error handling
- MongoDB database integration

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- Zod
- bcrypt

## Requirements

- Node.js
- npm
- MongoDB Atlas account or a supported MongoDB deployment

## Installation

Clone the repository and enter the project directory:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd loan-admin-backend
npm install
```

Create a `.env` file based on `.env.example` and configure your environment variables.

Start the development server:

```bash
npm run dev
```

## Environment Variables

Configure the following variables in `.env`:

- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `VIEWER_EMAIL`
- `VIEWER_PASSWORD`

Never commit `.env` or real credentials to GitHub.

## Seed Accounts

Configure the Admin and Viewer credentials in `.env`, then run:

```bash
npm run seed:accounts
```

Use the credentials to log in and obtain a JWT token. Do not expose production credentials in the repository.

## API Endpoints

### Authentication

| Method | Endpoint          | Access        |
| ------ | ----------------- | ------------- |
| POST   | `/api/auth/login` | Public        |
| GET    | `/api/auth/me`    | Authenticated |

### Loan Products

| Method | Endpoint            | Access        |
| ------ | ------------------- | ------------- |
| GET    | `/api/products`     | Authenticated |
| GET    | `/api/products/:id` | Authenticated |
| POST   | `/api/products`     | Admin         |
| PATCH  | `/api/products/:id` | Admin         |

### Applicants

| Method | Endpoint                                | Access        |
| ------ | --------------------------------------- | ------------- |
| GET    | `/api/applicants`                       | Authenticated |
| GET    | `/api/applicants/:id`                   | Authenticated |
| GET    | `/api/applicants/:id/eligible-products` | Authenticated |
| POST   | `/api/applicants`                       | Admin         |
| PATCH  | `/api/applicants/:id`                   | Admin         |

### Health Check

| Method | Endpoint      | Access |
| ------ | ------------- | ------ |
| GET    | `/api/health` | Public |

## Eligibility Rules

An applicant is eligible for a loan product only when all of the following conditions are satisfied:

1. Applicant age is within the product's minimum and maximum age.
2. Credit score meets the minimum requirement.
3. Employment type is allowed by the product.
4. Salary type is allowed by the product.
5. Monthly salary meets the minimum requirement.

An applicant is `Active` if at least one product matches all criteria. Otherwise, the applicant is `Rejected`.

## Automatic Re-evaluation

Eligibility is recalculated when:

- A new applicant is created.
- A new loan product is created.
- Existing product eligibility criteria are updated.
- Applicant details are updated.

## Testing

Run the eligibility service tests:

```bash
npm run test:eligibility
```

## Error Responses

The API returns JSON error responses with a `success` flag and a message. Common HTTP status codes include:

- `400` — Invalid request
- `401` — Authentication required or invalid
- `403` — Insufficient permissions
- `404` — Resource or route not found
- `409` — Duplicate record
- `500` — Internal server error

## Security

- Keep credentials and JWT secrets out of source control.
- Use Admin-only access for write operations.
- Validate request data on the server.
- Use HTTPS when deploying publicly.

## License

Add your chosen license here if applicable.
