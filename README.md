# Multi-Vendor E-commerce API

A RESTful backend API for a multi-vendor e-commerce application. The API is built with Node.js, Express, PostgreSQL, and Prisma ORM. It supports customer and seller roles, JWT-based authentication, store management, product management, and shopping-cart operations.

## Features

- User registration and login
- Password hashing with `bcryptjs`
- JWT-based authentication
- Role-based authorization for users and sellers
- Store creation, retrieval, updating, and deletion
- Product listing, retrieval, creation, updating, and deletion
- Shopping-cart retrieval, adding products, removing products, and clearing the cart
- PostgreSQL database access through Prisma ORM

> **Current scope:** The database schema contains `Order` and `Order_Item` models, but order-management API endpoints are not currently implemented. Cart items also do not currently support a quantity field.

## Technology Stack

- **Runtime:** Node.js (ES modules)
- **Web framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Authentication:** JSON Web Tokens (`jsonwebtoken`)
- **Password hashing:** `bcryptjs`
- **PostgreSQL driver:** `pg` with `@prisma/adapter-pg`
- **Development:** Node.js watch mode

## Project Structure

```text
Role-based Ecommerce App/
└── backend/
    ├── generated/
    │   └── prisma/              # Generated Prisma client (created by Prisma)
    ├── prisma/
    │   ├── migrations/          # Database migration history
    │   └── schema.prisma         # Database models and relationships
    ├── src/
    │   ├── controllers/          # Request handlers and application logic
    │   │   ├── authController.js
    │   │   ├── cartController.js
    │   │   ├── productController.js
    │   │   └── storeController.js
    │   ├── lib/
    │   │   └── db.js              # Prisma client/database setup
    │   ├── middleware/
    │   │   ├── authMiddleware.js  # JWT authentication
    │   │   └── roleMiddleware.js  # Role-based authorization
    │   ├── routes/                # Express route definitions
    │   │   ├── authRoutes.js
    │   │   ├── cartRoutes.js
    │   │   ├── productRoutes.js
    │   │   └── storeRoute.js
    │   ├── app.js                 # Express app and route registration
    │   ├── server.js              # HTTP server startup
    │   ├── test-connection.js     # Database connection test
    │   └── test-crud.js           # Database CRUD test
    ├── test/                      # HTTP requests for manual API testing
    │   ├── authTest.http
    │   ├── cartTest.http
    │   ├── productTest.http
    │   └── storeTest.http
    ├── .env.example
    ├── package.json
    └── prisma7.config.ts
```

The application separates route definitions from controller implementations. Authentication and role checks are handled by middleware before protected requests reach their controllers.

## Requirements

- Node.js with support for `--env-file` (Node.js 20.6 or later is recommended)
- npm
- PostgreSQL

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Role-based Ecommerce App/backend"
```

Replace `<repository-url>` with the URL of your Git repository.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `backend` directory using `.env.example` as a reference:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME"
PORT=5555
JWT_SECRET="replace-with-a-long-random-secret"
HASH_SALT=12
```

Configure each value for your local environment:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Port used by the Express server; defaults to `5555` in `server.js` |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `HASH_SALT` | bcrypt salt-rounds value used when hashing passwords |

### 4. Create the database

Create a PostgreSQL database matching the database name in `DATABASE_URL`.

### 5. Apply database migrations

From the `backend` directory, run:

```bash
npx prisma migrate dev
```

This applies the existing development migrations to your database.

### 6. Generate the Prisma client

```bash
npx prisma generate
```

The Prisma client is generated in `backend/generated/prisma`, as configured in `schema.prisma`.

### 7. Start the development server

```bash
npm run dev
```

The server listens on port `5555` by default, or on the port configured through `PORT`.

## API Reference

The examples below assume the server is running at `http://localhost:5555`. Protected endpoints require a valid JWT in the `Authorization` header:

```http
Authorization: Bearer <your-token>
```

### Authentication

Authentication routes are mounted under `/auth`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a user account |
| `POST` | `/auth/login` | Public | Log in and receive a JWT |

**Register**

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "your-password"
}
```

**Login**

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "alex@example.com",
  "password": "your-password"
}
```

A successful login or registration returns a JWT. Include that token when calling protected endpoints.

### Stores

Store routes are mounted under `/api/store`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/store` | Public | Retrieve stores |
| `GET` | `/api/store/:id` | Public | Retrieve a store by ID |
| `POST` | `/api/store` | Authenticated user | Create a store and become a seller |
| `PATCH` | `/api/store/:id` | Seller | Update the seller's store |
| `DELETE` | `/api/store/:id` | Seller | Delete the seller's store |

**Create a store**

```http
POST /api/store
Authorization: Bearer <your-token>
Content-Type: application/json
```

```json
{
  "name": "Alex's Store",
  "description": "An example online store"
}
```

A regular authenticated user creates a store through this endpoint. The application changes the user's role to seller as part of the store-creation flow. The schema allows one store per owner.

**Update a store**

```http
PATCH /api/store/1
Authorization: Bearer <seller-token>
Content-Type: application/json
```

```json
{
  "name": "Alex's Updated Store",
  "description": "Updated store description"
}
```

### Products

Product routes are mounted under `/api/product`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/product` | Public | Retrieve all products |
| `GET` | `/api/product?storeId=:storeId` | Public | Retrieve products belonging to a store |
| `GET` | `/api/product/:id` | Public | Retrieve a product by ID |
| `POST` | `/api/product` | Seller | Create a product in the seller's store |
| `PATCH` | `/api/product/:id` | Seller | Update a product owned by the seller |
| `DELETE` | `/api/product/:id` | Seller | Delete a product owned by the seller |

**Create a product**

```http
POST /api/product
Authorization: Bearer <seller-token>
Content-Type: application/json
```

```json
{
  "name": "Wireless Mouse",
  "description": "Wireless computer mouse",
  "price": 25.99,
  "stock_quantity": 50
}
```

The product is associated with the authenticated seller's store. Product ownership is checked for seller update and delete operations.

### Shopping Cart

Cart routes are mounted under `/api/cart`. All cart endpoints require authentication.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Authenticated | Retrieve the current user's cart items |
| `POST` | `/api/cart` | Authenticated | Add a product to the cart |
| `DELETE` | `/api/cart/:id` | Authenticated | Remove a product from the cart by product ID |
| `DELETE` | `/api/cart` | Authenticated | Remove all items from the cart |

**Add a product to the cart**

```http
POST /api/cart
Authorization: Bearer <your-token>
Content-Type: application/json
```

```json
{
  "productId": 1
}
```

**Remove a product from the cart**

```http
DELETE /api/cart/1
Authorization: Bearer <your-token>
```

Here, `1` is the product ID, not the cart-item ID.

## Roles and Permissions

The application currently has two roles:

| Role | Permissions |
|---|---|
| User | Register, log in, browse stores and products, manage their own cart, and create a store |
| Seller | Browse stores and products, manage their own store and its products, and use authenticated cart endpoints |

A user becomes a seller through store creation. Seller-only product and store-management operations are protected by authentication and role middleware. Controllers also check store ownership for seller operations.

## Manual API Testing

The `backend/test` directory contains `.http` request files for use with the REST Client extension in Visual Studio Code:

- `authTest.http`
- `storeTest.http`
- `productTest.http`
- `cartTest.http`

Start the API, configure the request bodies and IDs for your local database, and send requests from the editor. For protected requests, use a currently valid token obtained from the login or registration endpoint.

## Database Models

The Prisma schema currently defines these models:

- `User`
- `Store`
- `Product`
- `Cart`
- `Cart_Item`
- `Order`
- `Order_Item`

The schema defines the relationships between users, stores, products, carts, and orders. The order models represent database structure only at this stage; order API functionality has not yet been added.

## Notes

- This project is a backend API; it does not include a frontend application.
- The API currently uses manual HTTP request files for testing.
- Order creation, checkout, payment processing, and order-management endpoints are not implemented.
- The current cart model stores product associations but does not store item quantities.

## License

This project currently uses the `ISC` license declared in `backend/package.json`.