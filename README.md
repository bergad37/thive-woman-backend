# Thrive Woman Backend

Simple Node.js backend using:

- Express
- TypeScript
- TypeORM
- PostgreSQL
- JWT authentication

## Project structure

```text
src/
  config/        # database configuration
  controllers/   # business logic layer
  entities/      # TypeORM models
  middlewares/   # auth, error handling
  routes/        # API routes
  services/      # database access layer
  types/         # shared request types
  utils/         # helpers
```

Each feature follows the same flow:

`route -> controller -> service`

## Main features

- Authentication with JWT
- User management
- Product management
- Cart management
- Transaction management
- Stock summary
- Dashboard overview

## API base URL

```text
http://localhost:5000/api/v1
```

Examples:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users`
- `GET /api/v1/products`
- `GET /api/v1/carts/my-cart`
- `POST /api/v1/transactions`
- `GET /api/v1/stock/summary`

## Setup

1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env`.
3. Update database credentials.
4. Install dependencies:

```bash
npm install
```

5. Run the app:

```bash
npm run dev
```

TypeORM uses `synchronize: true` in development so tables are created automatically.

## Main entities

- `User`
- `Product`
- `Cart`
- `CartItem`
- `Transaction`
- `TransactionItem`

These entities are based on the screenshots:

- products have category, stock, distributed quantity, and status
- transactions have items, payment method, total, and status
- stock summary is derived from product stock values
