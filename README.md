# E-Commerce Backend API

> A production-ready, modular REST API powering end-to-end e-commerce operations — from authentication and catalog management to payments, order lifecycle, and admin operations.

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Authentication & Authorization](#authentication--authorization)
- [Email Notification System](#email-notification-system)
- [Order Lifecycle](#order-lifecycle)
- [Payment Lifecycle](#payment-lifecycle)
- [Customer APIs](#customer-apis)
- [Admin APIs](#admin-apis)
- [API Response Format](#api-response-format)
- [Swagger Documentation](#swagger-documentation)
- [Security](#security)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Project Overview

This project is a full-featured e-commerce backend API designed to serve as the data and business logic layer for **web storefronts**, **mobile applications**, and **admin dashboards**. It abstracts all platform-specific concerns into a consistent, versioned REST interface.

The API solves the core infrastructure problem of e-commerce: coordinating authentication, catalog, cart, order, and payment state across multiple client surfaces — while maintaining audit trails, transactional integrity, and real-time notifications at every step.

### Capabilities at a Glance

| Domain | Capabilities |
|---|---|
| **Identity** | Registration, OTP verification, JWT auth, refresh tokens, password reset |
| **Catalog** | Product management, slug-based URLs, search, filtering, pagination, sorting |
| **Commerce** | Wishlist, cart, orders, Razorpay payment integration |
| **Post-Purchase** | Invoice generation (PDF → Cloudinary), order status tracking, email notifications |
| **Reviews** | Product ratings, review CRUD, admin moderation |
| **Admin** | User moderation, product & order management, review oversight |
| **Infrastructure** | Cloudinary media uploads, Resend transactional emails, Swagger docs |

---

## Key Features

### Authentication
- User registration with email-based OTP verification
- Stateless JWT authentication (access + refresh token pair)
- Secure logout with token invalidation
- Forgot password → OTP → reset flow
- Authenticated password change

### User Management
- Profile read and update
- Avatar upload and deletion via Cloudinary
- Self-service account deletion

### Product Catalog
- Full product CRUD (admin-controlled)
- Slug-based public product URLs
- Server-side search, category filtering, pagination, and multi-field sorting
- Cloudinary-hosted product images with admin delete support

### Shopping Features
- Per-user persistent wishlist with add/remove
- Cart with line-item quantity management
- Order placement from cart with address selection
- Razorpay-powered checkout with signature verification

### Reviews
- Authenticated product reviews with star ratings
- Review update and deletion by author
- Admin review moderation and removal

### Admin Features
- User listing, stats, block/unblock
- Full product lifecycle management
- Order status progression with audit support
- Review moderation across all products

### Infrastructure
- **Cloudinary** — media upload/delete with URL persistence
- **Resend** — transactional email delivery for 13+ event types
- **Razorpay** — payment order creation, verification, and failure recording
- **Swagger UI** — interactive API documentation at `/api/v1/docs`
- **PDF Invoices** — auto-generated on order delivery, stored on Cloudinary

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js 22.x | JavaScript execution environment |
| **Framework** | Express.js 4.x | HTTP routing and middleware |
| **Language** | TypeScript 5.x | Type safety and developer experience |
| **Database** | MongoDB (Atlas) | Document store for all application data |
| **ODM** | Mongoose | Schema modeling, validation, and query building |
| **Validation** | Zod | Runtime schema validation for all request inputs |
| **Auth** | JSON Web Tokens (JWT) | Stateless access + refresh token strategy |
| **Hashing** | Argon2 | Industry-standard password hashing (Argon2id) |
| **Payments** | Razorpay | Payment order lifecycle and webhook verification |
| **Media** | Cloudinary | Image and PDF asset storage with CDN delivery |
| **Email** | Resend | Transactional email via React Email templates |
| **Docs** | Swagger / OpenAPI 3.0 | Auto-generated, interactive API documentation |

---

## Architecture Overview

The API follows a strict **3-layer architecture** to enforce separation of concerns and enable independent testability of each layer.

```
┌─────────────────────────────────────┐
│            HTTP Request              │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Middleware Layer             │
│  (Auth, RBAC, Validation, Upload)   │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│          Controller Layer            │
│  Parses request, delegates to       │
│  service, formats HTTP response     │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│           Service Layer              │
│  Business logic, orchestration,     │
│  external integrations (email,      │
│  payment, media)                    │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│          Database Layer              │
│  Mongoose models, schema            │
│  definitions, query execution       │
└─────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Responsibility |
|---|---|
| **Controllers** | Extract and validate request params/body, invoke service methods, return standardized HTTP responses |
| **Services** | Encapsulate all business logic, coordinate between models and third-party integrations, throw typed domain errors |
| **Models** | Define Mongoose schemas, instance methods, static helpers, and pre/post hooks |
| **Validators** | Zod schemas applied as middleware — request is rejected before reaching controller if invalid |
| **Middleware** | Auth verification, role-based access control, file upload handling, global error normalization |

---

## Project Structure
```text
src/
│
├── config/
│   ├── env.config.ts
│   ├── swagger.config.ts
│   └── index.ts
│
├── database/
│   └── mongoose.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── schema.validator.ts
│   └── ...
│
├── modules/
│
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.schema.ts
│   │   ├── auth.interface.ts
│   │   └── auth.model.ts
│   │
│   ├── users/
│   ├── address/
│   ├── products/
│   ├── wishlist/
│   ├── cart/
│   ├── orders/
│   ├── payments/
│   ├── reviews/
│   └── uploads/
│
│
│   └── admin/
│       ├── auth/
│       ├── users/
│       ├── products/
│       ├── orders/
│       └── reviews/
│
├── services/
│   └── email/
│       ├── email.service.ts
│       ├── email.interface.ts
│       ├── resend.config.ts
│       │
│       └── modules/
│           ├── auth/
│           │   ├── auth-email.service.ts
│           │   └── auth-email.template.ts
│           │
│           ├── orders/
│           │   ├── order-email.service.ts
│           │   └── order-email.template.ts
│           │
│           └── payments/
│               ├── payment-email.service.ts
│               └── payment-email.template.ts
│
├── types/
│   └── express/
│       └── index.d.ts
│
├── utils/
│   ├── errors/
│   │   ├── ApiError.ts
│   │   ├── BadRequestError.ts
│   │   ├── NotFoundError.ts
│   │   └── ...
│   │
│   ├── pdf/
│   │   └── invoice-generator.ts
│   │
│   ├── string/
│   │   └── slugify.ts
│   │
│   └── upload/
│       ├── cloudinary.ts
│       └── upload.utils.ts
│
├── app.ts
└── server.ts
```

### Architecture Highlights

* Modular feature-based architecture
* Separation of Controllers, Services, Schemas, Models, and Routes
* Dedicated Admin Module isolated from customer-facing APIs
* Centralized Email Service with module-specific email templates
* Cloudinary-based media management
* Razorpay payment integration
* PDF invoice generation utilities
* Zod-based request validation
* JWT authentication and role-based authorization
* Type-safe TypeScript implementation
* Scalable folder structure suitable for large applications

---

## Environment Variables

Copy `.env.example` to `.env` and populate all values before running.

```env
# ── Server ─────────────────────────────────────────
PORT=8000
NODE_ENV=development                  # development | production
API_PREFIX=/api/v1

# ── Database ───────────────────────────────────────
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db>

# ── JWT ────────────────────────────────────────────
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=<strong-random-secret>
JWT_REFRESH_EXPIRES_IN=7d

# ── Email (Resend) ─────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=no-reply@yourdomain.com

# ── Media (Cloudinary) ─────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Payments (Razorpay) ────────────────────────────
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret

# ── Branding ───────────────────────────────────────
COMPANY_NAME=YourCompany
```

> All environment variables are validated at startup via Zod. The server will refuse to boot if any required variable is missing or malformed.

---

## Authentication & Authorization

### Roles

| Role | Description |
|---|---|
| `customer` | Default role assigned on registration. Access to own resources only. |
| `admin` | Elevated privileges for platform management. Separate login endpoint. |

### Security Features

| Feature | Implementation |
|---|---|
| Password hashing | Argon2id with tuned memory/iteration parameters |
| Access tokens | Short-lived JWTs (15 min) signed with `JWT_ACCESS_SECRET` |
| Refresh tokens | Long-lived JWTs (7 days), stored and rotated on each refresh |
| Route protection | `authenticate` middleware validates Bearer token on protected routes |
| Role-based access | `authorize(...roles)` middleware enforces role requirements per route |
| Input validation | Zod schemas block malformed or malicious request payloads at the edge |

### Authentication Flow

```
POST /auth/register
        │
        ▼
  Create user (unverified)
  Send OTP via Resend
        │
        ▼
POST /auth/verify-otp
        │
        ▼
  Mark account verified
        │
        ▼
POST /auth/login
        │
        ▼
  Validate credentials (Argon2 verify)
  Issue Access Token + Refresh Token
        │
        ├──► Access Token → Authorization: Bearer <token>
        └──► Refresh Token → POST /auth/refresh-token
```

---

## Email Notification System

All emails are sent via **Resend** using templated content. Events trigger emails automatically within service-layer operations.

### Customer Emails

| Trigger | Email |
|---|---|
| Registration | Welcome + account confirmation |
| OTP request | Verification OTP |
| Forgot password | Password reset OTP |
| Order placed | Order received confirmation |
| Payment success | Payment confirmation with order summary |
| Payment failure | Payment failure notice |
| Order → Confirmed | Order confirmed by merchant |
| Order → Processing | Order being prepared |
| Order → Shipped | Shipment notification |
| Order → Delivered | Delivery confirmation with invoice link |
| Order → Cancelled | Cancellation confirmation |

### Admin Emails

| Trigger | Email |
|---|---|
| New order placed | New order notification with summary |
| Payment received | Payment confirmation for reconciliation |

---

## Order Lifecycle

Orders progress through a defined state machine. Status transitions are admin-controlled and each change is logged with a timestamp.

```
         ┌─────────────┐
         │   PENDING   │  ← Created on checkout
         └──────┬──────┘
                │  Admin confirms
         ┌──────▼──────┐
         │  CONFIRMED  │
         └──────┬──────┘
                │  Fulfillment begins
         ┌──────▼──────┐
         │  PROCESSING │
         └──────┬──────┘
                │  Handed to courier
         ┌──────▼──────┐
         │   SHIPPED   │
         └──────┬──────┘
                │  Delivered to customer
         ┌──────▼──────┐
         │  DELIVERED  │  → Invoice generated + emailed
         └─────────────┘

  ┌─────────────────────────────────────┐
  │  PENDING or CONFIRMED → CANCELLED   │  (customer or admin)
  └─────────────────────────────────────┘
```

- Each transition is recorded in a **status history array** for full audit trail support.
- Email notifications are dispatched automatically on every status change.
- PDF invoices are generated on delivery and stored on Cloudinary.

---

## Payment Lifecycle

Payments are processed via **Razorpay**. The API handles order creation, client-side checkout handoff, server-side signature verification, and failure recording.

```
POST /orders
        │
        ▼
   Order created (status: PENDING)
        │
        ▼
POST /payments/:orderId/initiate
        │
        ▼
   Razorpay order created
   razorpay_order_id returned to client
        │
        ▼
   [Client] Razorpay Checkout (browser/app)
        │
        ├── Success ──► POST /payments/verify
        │                     │
        │               Signature verified (HMAC)
        │               Payment status → SUCCESS
        │               Order status → CONFIRMED
        │               Email notifications sent
        │
        └── Failure ──► POST /payments/failure
                              │
                        Payment status → FAILED
                        Failure reason recorded
                        Customer notified via email
```

---

## Customer APIs

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | — | Register new account |
| `POST` | `/api/v1/auth/verify-otp` | — | Verify email OTP |
| `POST` | `/api/v1/auth/resend-otp` | — | Resend verification OTP |
| `POST` | `/api/v1/auth/login` | — | Authenticate and receive tokens |
| `POST` | `/api/v1/auth/forgot-password` | — | Send password reset OTP |
| `POST` | `/api/v1/auth/verify-reset-otp` | — | Validate reset OTP |
| `POST` | `/api/v1/auth/reset-password` | — | Set new password |
| `PUT` | `/api/v1/auth/change-password` | ✅ Bearer | Change password (authenticated) |
| `POST` | `/api/v1/auth/refresh-token` | — | Rotate access token |
| `POST` | `/api/v1/auth/logout` | ✅ Bearer | Invalidate session |

---

### User Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/users/me` | ✅ Bearer | Fetch authenticated user profile |
| `PATCH` | `/api/v1/users/me` | ✅ Bearer | Update profile fields |
| `PATCH` | `/api/v1/users/me/avatar` | ✅ Bearer | Upload/replace avatar (multipart) |
| `DELETE` | `/api/v1/users/me/avatar` | ✅ Bearer | Remove avatar from Cloudinary |
| `DELETE` | `/api/v1/users/me` | ✅ Bearer | Delete account and all associated data |

---

### Addresses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/addresses` | ✅ Bearer | List all saved addresses |
| `POST` | `/api/v1/addresses` | ✅ Bearer | Add new address |
| `GET` | `/api/v1/addresses/:addressId` | ✅ Bearer | Fetch single address |
| `PATCH` | `/api/v1/addresses/:addressId` | ✅ Bearer | Update address |
| `DELETE` | `/api/v1/addresses/:addressId` | ✅ Bearer | Delete address |

---

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/products` | — | List products with filters |
| `GET` | `/api/v1/products/:slug` | — | Fetch product by slug |

**Query Parameters for `GET /api/v1/products`:**

| Parameter | Type | Description |
|---|---|---|
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Results per page (default: 10) |
| `search` | `string` | Full-text search on name/description |
| `category` | `string` | Filter by category slug or ID |
| `sortBy` | `string` | Field to sort by (e.g. `price`, `createdAt`) |
| `order` | `asc \| desc` | Sort direction |

---

### Wishlist

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/wishlist` | ✅ Bearer | Fetch wishlist |
| `POST` | `/api/v1/wishlist/:productId` | ✅ Bearer | Add product to wishlist |
| `DELETE` | `/api/v1/wishlist/:productId` | ✅ Bearer | Remove product from wishlist |
| `DELETE` | `/api/v1/wishlist` | ✅ Bearer | Clear entire wishlist |

---

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/cart` | ✅ Bearer | Fetch cart with computed totals |
| `POST` | `/api/v1/cart/items` | ✅ Bearer | Add item to cart |
| `PATCH` | `/api/v1/cart/items/:productId` | ✅ Bearer | Update item quantity |
| `DELETE` | `/api/v1/cart/items/:productId` | ✅ Bearer | Remove item from cart |
| `DELETE` | `/api/v1/cart` | ✅ Bearer | Clear cart |

---

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/orders` | ✅ Bearer | Place order from cart |
| `GET` | `/api/v1/orders` | ✅ Bearer | List own orders (paginated) |
| `GET` | `/api/v1/orders/:orderId` | ✅ Bearer | Fetch order details |
| `PATCH` | `/api/v1/orders/:orderId/cancel` | ✅ Bearer | Cancel pending/confirmed order |
| `GET` | `/api/v1/orders/:orderId/invoice` | ✅ Bearer | Retrieve Cloudinary-hosted PDF invoice |

---

### Payments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/payments/:orderId/initiate` | ✅ Bearer | Create Razorpay order |
| `POST` | `/api/v1/payments/verify` | ✅ Bearer | Verify payment signature |
| `POST` | `/api/v1/payments/failure` | ✅ Bearer | Record payment failure |
| `GET` | `/api/v1/payments/:paymentId` | ✅ Bearer | Fetch payment details |

---

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/reviews/:productId` | ✅ Bearer | Submit review for a product |
| `GET` | `/api/v1/reviews/product/:productId` | — | Fetch all reviews for a product |
| `PATCH` | `/api/v1/reviews/:reviewId` | ✅ Bearer | Update own review |
| `DELETE` | `/api/v1/reviews/:reviewId` | ✅ Bearer | Delete own review |

---

### Uploads

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/upload` | ✅ Bearer | Upload file to Cloudinary (multipart) |
| `DELETE` | `/api/v1/upload` | ✅ Bearer | Delete file from Cloudinary by public ID |

---

## Admin APIs

All admin routes require `Authorization: Bearer <admin_token>` and `role: admin`.

### Admin Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/admin/auth/login` | Admin login (separate credential scope) |
| `POST` | `/api/v1/admin/auth/logout` | Invalidate admin session |

---

### Admin — User Management

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/users` | List all users (paginated, filterable) |
| `GET` | `/api/v1/admin/users/stats` | Platform user statistics |
| `GET` | `/api/v1/admin/users/:userId` | Fetch individual user profile |
| `PATCH` | `/api/v1/admin/users/:userId/block` | Block user account |
| `PATCH` | `/api/v1/admin/users/:userId/unblock` | Restore blocked user |

---

### Admin — Product Management

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/admin/products` | Create product |
| `GET` | `/api/v1/admin/products` | List all products |
| `GET` | `/api/v1/admin/products/:productId` | Fetch product by ID |
| `PATCH` | `/api/v1/admin/products/:productId` | Update product fields |
| `DELETE` | `/api/v1/admin/products/:productId` | Delete product |
| `DELETE` | `/api/v1/admin/products/:id/image` | Remove product image from Cloudinary |

---

### Admin — Order Management

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/orders` | List all orders (paginated) |
| `GET` | `/api/v1/admin/orders/:orderId` | Fetch order details |
| `PATCH` | `/api/v1/admin/orders/:orderId/status` | Update order status |

**Supported status transitions via `PATCH /status`:**

```
confirmed → processing → shipped → delivered
confirmed → cancelled
pending   → cancelled
```

---

### Admin — Review Moderation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/reviews` | List all reviews across products |
| `GET` | `/api/v1/admin/reviews/:reviewId` | Fetch individual review |
| `DELETE` | `/api/v1/admin/reviews/:reviewId` | Remove review (policy violation) |

---

## API Response Format

All endpoints return a consistent JSON envelope.

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "_id": "64f1a...",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Products fetched",
  "data": {
    "products": [...],
    "pagination": {
      "total": 84,
      "page": 2,
      "limit": 10,
      "totalPages": 9
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

| HTTP Status | Meaning |
|---|---|
| `200` | OK |
| `201` | Resource created |
| `400` | Bad request / validation failure |
| `401` | Unauthenticated |
| `403` | Unauthorized (insufficient role) |
| `404` | Resource not found |
| `409` | Conflict (e.g. duplicate email) |
| `500` | Internal server error |

---

## Swagger Documentation

Interactive API documentation is available at:

```
GET /api/v1/docs
```

The Swagger UI is generated from inline OpenAPI 3.0 annotations and provides:

- **Request schemas** — typed body, query, and path parameter definitions
- **Response schemas** — documented success and error shapes per endpoint
- **Authentication** — Bearer token input via the Authorize button
- **Interactive testing** — execute requests directly from the browser without a separate HTTP client

---

## Security

| Measure | Details |
|---|---|
| **JWT Access Tokens** | Short-lived (15 min), stateless, verified on every protected request |
| **JWT Refresh Tokens** | Long-lived (7 days), rotated on each use, invalidated on logout |
| **Argon2id Hashing** | Memory-hard password hashing resistant to GPU and side-channel attacks |
| **RBAC** | Role enforcement at the middleware layer — admin routes inaccessible to customers |
| **Zod Validation** | All request inputs validated before reaching controller or service |
| **Environment Validation** | Zod schema validates all env vars at startup — no silent misconfigurations |
| **Upload Validation** | File type and size limits enforced before Cloudinary upload |
| **Global Error Handler** | Centralized error normalization — no raw stack traces leaked to clients |
| **Protected Routes** | Unauthenticated access to protected endpoints returns `401` immediately |

---

## Deployment

### Required External Services

| Service | Purpose | Setup |
|---|---|---|
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Managed database | Create cluster → get connection URI |
| [Cloudinary](https://cloudinary.com) | Media and PDF storage | Create account → get cloud credentials |
| [Resend](https://resend.com) | Transactional email | Create account → verify domain → get API key |
| [Razorpay](https://razorpay.com) | Payment processing | Create account → get Key ID and Secret |

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ecommerce-backend-api.git
cd ecommerce-backend-api

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Populate all values in .env

# 4. Build TypeScript
npm run build

# 5. Start production server
npm start

# Development (with hot reload)
npm run dev
```

---

## Future Improvements

| Feature | Description |
|---|---|
| **Coupons & Discounts** | Promo code engine with usage limits and expiry |
| **Inventory Management** | Stock tracking with low-stock alerts and backorder support |
| **Analytics Dashboard** | Revenue, order volume, and product performance metrics |
| **Shipment Tracking** | Carrier integration for real-time delivery tracking |
| **Refund Management** | Razorpay refund initiation with status tracking |
| **Webhooks** | Event-driven integration support for external platforms |
| **Multi-Vendor Marketplace** | Seller accounts with independent product catalogs and payouts |

---

## Author

**Ankit Mishra**

Backend Developer — Node.js · TypeScript · Express.js · MongoDB · REST APIs

[![GitHub](https://img.shields.io/badge/GitHub-@ankitmishra-181717?logo=github)](https://github.com/ankitmishra)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ankit_Mishra-0A66C2?logo=linkedin)](https://linkedin.com/in/ankitmishra)

---

<p align="center">Built with precision. Designed for scale.</p>
