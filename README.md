# Loan Products Admin Panel — Backend

A secure, RESTful API built with **Node.js, Express.js, and MongoDB** for managing loan products, loan applicants, user authentication, and automated loan eligibility evaluation.

The application supports role-based access control for Admin and Viewer accounts, validates incoming requests, and automatically recalculates applicant eligibility whenever relevant applicant details or loan product criteria change.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seed Accounts](#seed-accounts)
- [Authentication and Authorization](#authentication-and-authorization)
- [API Documentation](#api-documentation)
- [Loan Eligibility Rules](#loan-eligibility-rules)
- [Automatic Eligibility Re-evaluation](#automatic-eligibility-re-evaluation)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Production Deployment](#production-deployment)
- [Security Best Practices](#security-best-practices)
- [License](#license)

## Overview

The Loan Products Admin Panel Backend provides APIs to manage loan products and applicants while maintaining up-to-date eligibility information.

Administrators can create and update loan products, register applicants, and modify applicant details. Viewers can access permitted resources without performing write operations.

The eligibility engine evaluates applicants against loan product requirements and determines which products they qualify for.

**Live API:** https://loan-admin-f9ut.onrender.com

**Repository:** https://github.com/ShivendraPandey26/Loan-Admin-Backend

## Features

- **JWT Authentication:** Secure login using JSON Web Tokens.
- **Role-Based Authorization:** Separate permissions for Admin and Viewer roles.
- **Loan Product Management:** Create, list, retrieve, and update loan products.
- **Applicant Management:** Create, list, retrieve, and update applicant records.
- **Automated Eligibility Evaluation:** Evaluate applicants against configurable loan criteria.
- **Eligible Product Listing:** Retrieve loan products that match an applicant's profile.
- **Automatic Re-evaluation:** Recalculate eligibility when applicant information or product criteria change.
- **Request Validation:** Validate incoming data using Zod.
- **Password Security:** Hash account passwords using bcrypt.
- **Centralized Error Handling:** Return consistent JSON error responses.
- **MongoDB Integration:** Persist application data using MongoDB Atlas and Mongoose.
- **Health Check:** Expose an endpoint for basic API availability checks.
- **Automated Tests:** Test the loan eligibility evaluation service.

## Technology Stack

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| Node.js              | JavaScript runtime      |
| Express.js           | REST API framework      |
| MongoDB Atlas        | Cloud database          |
| Mongoose             | MongoDB object modeling |
| JSON Web Token (JWT) | Authentication          |
| bcrypt               | Password hashing        |
| Zod                  | Request data validation |
| npm                  | Dependency management   |

## Architecture

The backend follows a modular API architecture that separates request handling, business logic, data persistence, and authorization.

```text
Client / Frontend
       |
       v
Express.js REST API
       |
       v
Authentication & Authorization
       |
       v
Request Validation (Zod)
       |
       v
Controllers
       |
       v
Services / Eligibility Engine
       |
       v
Mongoose Models
       |
       v
MongoDB Atlas
```

Typical request flow:

1. The client sends an HTTP request.
2. Authentication middleware verifies the JWT when required.
3. Authorization middleware checks the user's role.
4. Validation middleware checks incoming data.
5. The controller processes the request through the appropriate business logic.
6. Mongoose interacts with MongoDB.
7. The API returns a JSON response.

## Getting Started

### Prerequisites

Ensure the following are installed or configured:

- Node.js and npm
- A MongoDB Atlas account
- Git
- Postman or another API client

### 1. Clone the Repository

```bash
git clone https://github.com/ShivendraPandey26/Loan-Admin-Backend.git

cd Loan-Admin-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as a reference.

```bash
cp .env.example .env
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env
```

Configure the required values in your `.env` file.

### 4. Configure MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user with an appropriate password.
3. Configure network access to allow connections from your deployment environment.
4. Copy the MongoDB connection string.
5. Add it to `MONGODB_URI` in your `.env` file.

Use a properly URL-encoded password if it contains special characters.

### 5. Seed Initial Accounts

Configure the Admin and Viewer credentials in your environment variables, then execute:

```bash
npm run seed:accounts
```

Run the seed script only as intended by the project and avoid using predictable default credentials in production.

### 6. Start the Development Server

```bash
npm run dev
```

The API should start on the port configured in your environment.

Check the health endpoint:

```http
GET /api/health
```

For local development, the complete URL is typically:

```text
http://localhost:PORT/api/health
```

Replace `PORT` with your configured port.

## Environment Variables

The application uses environment variables for configuration and sensitive values.

| Variable          | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `PORT`            | Port on which the server listens                               |
| `NODE_ENV`        | Application environment, such as `development` or `production` |
| `MONGODB_URI`     | MongoDB Atlas connection string                                |
| `JWT_SECRET`      | Secret used to sign and verify JWTs                            |
| `JWT_EXPIRES_IN`  | JWT expiration duration                                        |
| `CLIENT_URL`      | Permitted frontend origin for CORS                             |
| `ADMIN_EMAIL`     | Initial Admin account email                                    |
| `ADMIN_PASSWORD`  | Initial Admin account password                                 |
| `VIEWER_EMAIL`    | Initial Viewer account email                                   |
| `VIEWER_PASSWORD` | Initial Viewer account password                                |

Example `.env.example`:

```dotenv
PORT=5000
NODE_ENV=development

MONGODB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=1d

CLIENT_URL=http://localhost:5173

ADMIN_EMAIL=
ADMIN_PASSWORD=

VIEWER_EMAIL=
VIEWER_PASSWORD=
```

The values above are examples, not production credentials. Adjust them to match the application's configuration and validation rules.

**Important:** Never commit `.env` files, database credentials, passwords, or JWT secrets to version control. Keep `.env.example` free of real secrets.

## Seed Accounts

The application supports two roles:

| Role   | Permissions                                                                |
| ------ | -------------------------------------------------------------------------- |
| Admin  | View permitted resources and create or update loan products and applicants |
| Viewer | Access permitted read-only endpoints                                       |

Create or initialize these accounts using:

```bash
npm run seed:accounts
```

The seed script should be safe to rerun and should not create duplicate accounts or overwrite existing production credentials unexpectedly.

## Authentication and Authorization

The API uses JWT-based authentication.

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

Example request:

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Use the credentials configured for your seeded account.

After a successful login, use the returned JWT in subsequent protected requests.

### Authenticated Requests

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Current User

```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

This endpoint returns the authenticated user's information according to the API's response format.

### Authorization Rules

- Public endpoints do not require authentication.
- Protected endpoints require a valid JWT.
- Admin-only endpoints require an authenticated Admin account.
- Viewer accounts cannot create or update resources.
- Expired or invalid tokens must be rejected.

## API Documentation

**Base URL**

Production:

```text
https://loan-admin-f9ut.onrender.com
```

Local:

```text
http://localhost:PORT
```

All API paths below are relative to the base URL.

### 1. Health Check

| Method | Endpoint      | Access |
| ------ | ------------- | ------ |
| GET    | `/api/health` | Public |

Checks basic API availability.

### 2. Authentication

| Method | Endpoint          | Access        | Description                             |
| ------ | ----------------- | ------------- | --------------------------------------- |
| POST   | `/api/auth/login` | Public        | Authenticate a user and obtain a JWT    |
| GET    | `/api/auth/me`    | Authenticated | Retrieve the current user's information |

### 3. Loan Products

| Method | Endpoint            | Access        | Description              |
| ------ | ------------------- | ------------- | ------------------------ |
| GET    | `/api/products`     | Authenticated | Retrieve loan products   |
| GET    | `/api/products/:id` | Authenticated | Retrieve a product by ID |
| POST   | `/api/products`     | Admin         | Create a loan product    |
| PATCH  | `/api/products/:id` | Admin         | Update a loan product    |

**Example: Create a Loan Product**

```http
POST /api/products
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

The request body must match the loan product schema implemented in the application.

Example structure:

```json
{
  "name": "Personal Loan",
  "minAge": 21,
  "maxAge": 60,
  "minCreditScore": 700,
  "employmentTypes": ["Salaried"],
  "salaryTypes": ["Monthly"],
  "minMonthlySalary": 25000
}
```

This is an illustrative payload. Confirm the exact field names and allowed values in the product validation schema before using it.

### 4. Applicants

| Method | Endpoint                                | Access        | Description                                 |
| ------ | --------------------------------------- | ------------- | ------------------------------------------- |
| GET    | `/api/applicants`                       | Authenticated | Retrieve applicants                         |
| GET    | `/api/applicants/:id`                   | Authenticated | Retrieve an applicant by ID                 |
| GET    | `/api/applicants/:id/eligible-products` | Authenticated | Retrieve eligible products for an applicant |
| POST   | `/api/applicants`                       | Admin         | Create an applicant                         |
| PATCH  | `/api/applicants/:id`                   | Admin         | Update an applicant                         |

**Example: Retrieve Eligible Products**

```http
GET /api/applicants/APPLICANT_ID/eligible-products
Authorization: Bearer YOUR_JWT_TOKEN
```

Replace `APPLICANT_ID` with the MongoDB ID of the applicant.

The API evaluates the applicant against the configured loan criteria and returns the matching products according to the implementation's response format.

### API Access Summary

| Resource               | Admin  | Viewer |
| ---------------------- | ------ | ------ |
| Health check           | Public | Public |
| Login                  | Public | Public |
| View current account   | Yes    | Yes    |
| View loan products     | Yes    | Yes    |
| Create loan products   | Yes    | No     |
| Update loan products   | Yes    | No     |
| View applicants        | Yes    | Yes    |
| Create applicants      | Yes    | No     |
| Update applicants      | Yes    | No     |
| View eligible products | Yes    | Yes    |

Authorization is enforced by the backend and must not rely solely on frontend restrictions.

## Loan Eligibility Rules

An applicant qualifies for a loan product only when **all five conditions** are satisfied.

| Rule            | Requirement                                                     |
| --------------- | --------------------------------------------------------------- |
| Age             | Applicant's age is within the product's minimum and maximum age |
| Credit Score    | Applicant's credit score meets the minimum requirement          |
| Employment Type | Applicant's employment type is permitted                        |
| Salary Type     | Applicant's salary type is permitted                            |
| Monthly Salary  | Applicant's monthly salary meets the minimum requirement        |

### Eligibility Decision

The eligibility engine evaluates each applicant against the available loan products.

- **Active:** At least one loan product matches every eligibility condition.
- **Rejected:** No available loan product matches all eligibility conditions.

These statuses describe the application's eligibility evaluation and should not be interpreted as an actual lender's approval or rejection of a loan application.

### Example

Suppose a loan product requires:

- Minimum age: 21 years
- Maximum age: 60 years
- Minimum credit score: 700
- Employment type: Salaried
- Salary type: Monthly
- Minimum monthly salary: ₹25,000

An applicant meeting all these requirements qualifies for this product.

If the applicant fails even one condition, they do not qualify for that particular product.

## Automatic Eligibility Re-evaluation

Eligibility is recalculated when changes may affect the result.

| Event                         | Expected Behaviour                                                    |
| ----------------------------- | --------------------------------------------------------------------- |
| New applicant created         | Evaluate the applicant against available products                     |
| New loan product created      | Re-evaluate existing applicants against the updated product catalogue |
| Loan product criteria updated | Re-evaluate applicants against the revised criteria                   |
| Applicant details updated     | Re-evaluate the updated applicant against available products          |

This keeps eligibility information consistent with the current applicant details and loan product criteria.

For production deployments, ensure that recalculation failures are handled appropriately and that large-scale re-evaluations are designed to avoid excessive database load.

## Error Handling

The API returns JSON error responses for failed requests.

The following is an illustrative response format; the exact response body depends on the implementation.

```json
{
  "success": false,
  "message": "Invalid request"
}
```

### Common HTTP Status Codes

| Status                      | Meaning                                        |
| --------------------------- | ---------------------------------------------- |
| `200 OK`                    | Request completed successfully                 |
| `201 Created`               | Resource created successfully                  |
| `400 Bad Request`           | Invalid request or validation failure          |
| `401 Unauthorized`          | Missing, invalid, or expired authentication    |
| `403 Forbidden`             | Insufficient permissions                       |
| `404 Not Found`             | Resource or route not found                    |
| `409 Conflict`              | Duplicate record or conflicting resource state |
| `500 Internal Server Error` | Unexpected server-side error                   |

Clients should use HTTP status codes rather than relying exclusively on response messages.

Production error responses should avoid exposing stack traces, database details, secrets, or internal implementation information.

## Testing

Run the loan eligibility service tests using:

```bash
npm run test:eligibility
```

The test suite should verify the eligibility engine's behaviour against expected results.

Recommended additional test cases include:

- Applicants meeting all eligibility conditions.
- Applicants failing each individual eligibility condition.
- Applicants below and above the permitted age range.
- Applicants with credit scores below the minimum requirement.
- Applicants with unsupported employment or salary types.
- Applicants with salaries below the minimum threshold.
- Applicants qualifying for multiple products.
- Eligibility changes following applicant updates.
- Eligibility changes following product creation or criteria updates.
- Unauthorized and insufficient-permission requests.

These are recommended test cases, not a claim that all are already implemented.

## Production Deployment

The backend is deployed at:

**Live API:** https://loan-admin-f9ut.onrender.com

For deployment on Render or another Node.js hosting provider:

1. Connect the Git repository to the hosting provider.
2. Configure the production environment variables.
3. Configure MongoDB Atlas network access for the deployment environment.
4. Set `NODE_ENV=production`.
5. Configure the appropriate build and start commands.
6. Ensure the server listens on the configured port.
7. Verify the health endpoint.
8. Test authentication, role-based access, CRUD operations, and eligibility evaluation.
9. Review application logs and database connectivity.
10. Confirm that production credentials and secrets are not exposed.

Use the actual start script defined in `package.json`. The development command `npm run dev` should not automatically be assumed to be the production start command.

### Deployment Checklist

- [ ] Production environment variables configured.
- [ ] Strong JWT secret configured.
- [ ] MongoDB Atlas access restricted appropriately.
- [ ] Production Admin and Viewer accounts initialized securely.
- [ ] CORS restricted to trusted frontend origins.
- [ ] HTTPS enabled.
- [ ] Error handling and logging verified.
- [ ] Eligibility tests passing.
- [ ] API endpoints tested after deployment.
- [ ] Database backups and recovery procedures reviewed.

## Security Best Practices

- Store passwords as secure hashes; never store plaintext passwords.
- Keep `.env` and secret files out of version control.
- Use a strong, unpredictable JWT signing secret.
- Enforce token expiration and verify tokens on protected routes.
- Apply authorization checks on every protected write operation.
- Validate request bodies, route parameters, and query parameters.
- Restrict CORS to approved frontend origins.
- Use HTTPS for all public API communication.
- Apply appropriate request rate limits, especially to authentication endpoints.
- Avoid returning password hashes, tokens, or sensitive internal data in API responses.
- Restrict database access using least-privilege credentials and appropriate network rules.
- Use structured logging without recording passwords, JWTs, or other secrets.
- Review dependencies and apply security updates regularly.

<!-- ## Contributing

Contributions and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run the relevant tests.
5. Submit a pull request describing the changes.

Ensure that changes preserve the existing API contracts and include tests for new eligibility or authorization behaviour.

## License

No license has been specified yet. Add a `LICENSE` file and update this section when a license has been selected. -->

---

**Built with Node.js, Express.js, and MongoDB.**
