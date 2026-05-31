# E-Commerce Backend API

## Overview

A scalable and production-oriented E-Commerce backend built with Node.js, TypeScript, Express, and MongoDB.

The project follows a modular architecture and focuses on backend engineering best practices including:

* RESTful API design
* JWT Authentication & Authorization
* Role-Based Access Control
* Schema Validation using Zod
* Swagger API Documentation
* MongoDB Data Modeling
* Cloudinary File Management
* Error Handling Middleware
* Service Layer Architecture
* TypeScript Type Safety

The API is designed to support both customer-facing and admin-facing operations.

---

# Tech Stack

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* MongoDB
* Mongoose

## Authentication & Security

- JWT Access Tokens
- JWT Refresh Tokens
- HTTP Only Cookies
- Secure Cookie-Based Authentication
- Password Hashing using bcrypt
- Role-Based Access Control (RBAC)
- Protected Route Middleware
- Zod Request Validation
- Environment Variable Validation
- Global Error Handling

### Authentication Features

- User Registration
- Email Verification via OTP
- Login & Logout
- Password Reset via OTP
- Refresh Token Rotation
- HTTP Only Cookie Storage
- Role-Based Authorization

## Validation

* Zod

## API Documentation

* Swagger / OpenAPI

## File Upload & Media

* Multer
* Cloudinary

## Email Services

* Resend

---

# Environment Variables

```env
PORT=
NODE_ENV=
API_PREFIX=

MONGO_URI=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

RESEND_API_KEY=
EMAIL_FROM=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# Project Architecture

```text
src
├── modules
│   ├── auth
│   ├── categories
│   ├── products
│   ├── uploads
│   ├── cart
│   └── admin
│
├── middleware
├── utils
├── config
├── routes
└── app.ts
```

---

# Implemented Modules

## Authentication Module

### Customer Authentication APIs

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| POST   | /api/v1/auth/register         | Register user           |
| POST   | /api/v1/auth/verify-otp       | Verify email OTP        |
| POST   | /api/v1/auth/resend-otp       | Resend OTP              |
| POST   | /api/v1/auth/login            | Login user              |
| POST   | /api/v1/auth/forgot-password  | Send password reset OTP |
| POST   | /api/v1/auth/verify-reset-otp | Verify reset OTP        |
| POST   | /api/v1/auth/reset-password   | Reset password          |
| PATCH  | /api/v1/auth/change-password  | Change password         |
| POST   | /api/v1/auth/refresh-token    | Refresh access token    |
| POST   | /api/v1/auth/logout           | Logout user             |

### Admin Authentication APIs

| Method | Endpoint                  | Description  |
| ------ | ------------------------- | ------------ |
| POST   | /api/v1/admin/auth/login  | Admin login  |
| POST   | /api/v1/admin/auth/logout | Admin logout |

---

## Category Module

### Public APIs

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | /api/v1/categories       | Get active categories |
| GET    | /api/v1/categories/:slug | Get category details  |

### Admin APIs

| Method | Endpoint                             | Description          |
| ------ | ------------------------------------ | -------------------- |
| POST   | /api/v1/admin/categories             | Create category      |
| GET    | /api/v1/admin/categories             | Get all categories   |
| GET    | /api/v1/admin/categories/:categoryId | Get category details |
| PATCH  | /api/v1/admin/categories/:categoryId | Update category      |
| DELETE | /api/v1/admin/categories/:categoryId | Delete category      |

---

## Product Module

### Public APIs

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | /api/v1/products       | Get active products |
| GET    | /api/v1/products/:slug | Get product details |

Features:

* Pagination
* Search
* Category Filtering
* Sorting
* Product Slugs

### Admin APIs

| Method | Endpoint                          | Description          |
| ------ | --------------------------------- | -------------------- |
| POST   | /api/v1/admin/products            | Create product       |
| GET    | /api/v1/admin/products            | Get all products     |
| GET    | /api/v1/admin/products/:productId | Get product details  |
| PATCH  | /api/v1/admin/products/:productId | Update product       |
| DELETE | /api/v1/admin/products/:productId | Soft delete product  |
| DELETE | /api/v1/admin/products/:id/image  | Delete product image |

Features:

* Product Status Management
* Draft Products
* Active Products
* Inactive Products
* Soft Delete
* Image Management
* Cloudinary Integration
* Product Tags

---

## Upload Module

Protected endpoints used for image management.

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| POST   | /api/v1/upload | Upload image          |
| DELETE | /api/v1/upload | Delete uploaded image |

Features:

* Cloudinary Upload
* Cloudinary Deletion
* File Type Validation
* File Size Validation
* Memory Storage Uploads

---

## Cart Module

Authenticated customer cart management.

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | /api/v1/cart                  | Get current user's cart  |
| POST   | /api/v1/cart/items            | Add product to cart      |
| PATCH  | /api/v1/cart/items/:productId | Update cart quantity     |
| DELETE | /api/v1/cart/items/:productId | Remove product from cart |
| DELETE | /api/v1/cart                  | Clear cart               |

Features:

* Stock Validation
* Product Availability Validation
* Cart Quantity Updates
* Maximum Cart Item Limits
* Automatic Cart Creation

---

# Current Progress

## Completed

* Authentication Module
* Admin Authentication Module
* Category Module
* Product Module
* Upload Module
* Cart Module
* JWT Authentication
* Role-Based Authorization
* Swagger Documentation
* Zod Validation
* Cloudinary Integration
* Resend Email Integration

---

# Pending Modules

## User Profile & Address Module

Planned APIs:

### Profile APIs

| Method | Endpoint                        |
| -------| ------------------------------- |
| GET    | /api/v1/profile                 |
| PATCH  | /api/v1/profile                 |
| PATCH  | /api/v1/profile/change-password |

### Address APIs

| Method | Endpoint                        |
| -------| ------------------------------- |
| GET    | /api/v1/addresses              |
| POST   | /api/v1/addresses              |
| GET    | /api/v1/addresses/:addressId   |
| PATCH  | /api/v1/addresses/:addressId   |
| DELETE | /api/v1/addresses/:addressId   |

---

## Wishlist Module

Planned APIs:

| Method | Endpoint                          |
| ------ | --------------------------------- |
| GET    | /api/v1/wishlist                  |
| POST   | /api/v1/wishlist/items            |
| DELETE | /api/v1/wishlist/items/:productId |

---

## Order Module

Planned APIs:

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/v1/orders     |
| GET    | /api/v1/orders     |
| GET    | /api/v1/orders/:id |

### Admin Order APIs

| Method | Endpoint                        |
| ------ | ------------------------------- |
| GET    | /api/v1/admin/orders            |
| GET    | /api/v1/admin/orders/:id        |
| PATCH  | /api/v1/admin/orders/:id/status |

---

## Payment Module

Planned Features:

* Razorpay Integration
* Create Payment Order
* Verify Payment
* Payment Status Tracking
* Order Payment Synchronization

---

## Dashboard Module

Planned Features:

* Total Users
* Total Orders
* Total Products
* Total Revenue
* Recent Orders
* Top Selling Products

---

# Security Features

* JWT Access Tokens
* Refresh Token Support
* Password Hashing (bcrypt)
* Role-Based Access Control
* Protected Routes
* Zod Request Validation
* Environment Variable Validation
* Global Error Handling
* File Upload Validation

---

# API Documentation

Swagger/OpenAPI documentation is integrated for all implemented modules.

Documentation includes:

* Request Schemas
* Response Schemas
* Authentication Requirements
* Route Descriptions
* Interactive API Testing

---

# Future Enhancements

* Product Reviews & Ratings
* Coupons & Discounts
* Inventory Reports
* Analytics Dashboard
* Order Tracking
* Notification System
* Address Management
* Payment Webhooks

---

# Project Status

Current Development Progress:

Completed:

* Authentication
* Categories
* Products
* Uploads
* Cart

In Progress:

* Remaining Core E-Commerce Modules

Pending:

* User Profile
* User Address
* Wishlist
* Orders
* Payments
* Dashboard
