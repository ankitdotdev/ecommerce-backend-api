# E-Commerce Backend API System

## Project Overview

This project focuses on the development of a scalable and secure RESTful backend API for an E-Commerce platform using Node.js, TypeScript, MongoDB, and Swagger documentation.

The system is designed to handle core E-Commerce operations such as user authentication, product management, cart management, order processing, and image uploads through a modular backend architecture.

The primary objective of the project is to implement production-style backend engineering practices including REST API design, authentication and authorization, database modeling, middleware handling, validation, error management, and API documentation.

The backend exposes secure API endpoints that can be consumed by frontend applications, mobile applications, or third-party systems.

---

# Project Objectives

* Develop a secure RESTful API using Node.js and TypeScript
* Design scalable backend architecture for E-Commerce operations
* Implement JWT-based authentication and authorization
* Create CRUD operations for products, users, carts, and orders
* Manage product image uploads
* Integrate MongoDB for persistent data storage
* Implement middleware for validation and error handling
* Generate API documentation using Swagger/OpenAPI
* Follow modular and maintainable backend development practices

---

# Tech Stack

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* MongoDB
* Mongoose ODM

## Authentication & Security

* JWT (JSON Web Tokens)
* bcrypt

## API Documentation

* Swagger / OpenAPI

## File Upload

* Multer

## Development Tools

* Postman
* Nodemon
* dotenv

---

# Core Modules

## 1. Authentication Module

Handles user registration, login, token generation, and authorization.

### Features

* User registration
* User login
* Password hashing
* JWT token generation
* Protected routes
* Role-based authorization

---

## 2. Product Management Module

Handles product-related operations for the E-Commerce platform.

### Features

* Add products
* Update products
* Delete products
* Fetch all products
* Fetch single product
* Product image upload
* Product categorization

---

## 3. Cart Management Module

Handles customer cart operations.

### Features

* Add item to cart
* Remove item from cart
* Update cart quantity
* Fetch user cart
* Clear cart

---

## 4. Order Management Module

Handles customer order processing.

### Features

* Create order
* Fetch user orders
* Fetch order by ID
* Update order status
* Cancel order
* Order history tracking

---

# API Overview

## Authentication APIs

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| POST   | /api/auth/register         | Register new user               |
| POST   | /api/auth/verify-otp       | Verify email OTP                |
| POST   | /api/auth/resend-otp       | Resend verification OTP         |
| POST   | /api/auth/login            | Login verified user             |
| POST   | /api/auth/forgot-password  | Send password reset OTP         |
| POST   | /api/auth/verify-reset-otp | Verify reset password OTP       |
| POST   | /api/auth/reset-password   | Reset password                  |
| PUT    | /api/auth/change-password  | Change password while logged in |
| POST   | /api/auth/refresh-token    | Refresh access token            |
| POST   | /api/auth/logout           | Logout authenticated user       |


---

## Product APIs

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| GET    | /api/products        | Fetch all products   |
| GET    | /api/products/:id    | Fetch single product |
| POST   | /api/products        | Create product       |
| PUT    | /api/products/:id    | Update product       |
| DELETE | /api/products/:id    | Delete product       |
| POST   | /api/products/upload | Upload product image |

---

## Cart APIs

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| GET    | /api/cart            | Fetch user cart       |
| POST   | /api/cart            | Add item to cart      |
| PUT    | /api/cart/:productId | Update cart item      |
| DELETE | /api/cart/:productId | Remove item from cart |
| DELETE | /api/cart            | Clear cart            |

---

## Order APIs

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | /api/orders     | Create order        |
| GET    | /api/orders     | Fetch user orders   |
| GET    | /api/orders/:id | Fetch order details |
| PUT    | /api/orders/:id | Update order status |
| DELETE | /api/orders/:id | Cancel order        |

---

# Estimated API Count

| Module         | Approx APIs |
| -------------- | ----------- |
| Authentication | 4           |
| Products       | 6           |
| Cart           | 5           |
| Orders         | 5           |
| Total          | 20+ APIs    |

The project can be further extended with:

* Payment gateway integration
* Wishlist module
* Admin dashboard APIs
* Product reviews and ratings
* Inventory management
* Search and filtering
* Pagination
* Coupon system

---

# Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected Routes Middleware
* Request Validation
* Environment Variable Protection
* Error Handling Middleware
* Role-Based Access Control

---

# Swagger API Documentation

Swagger/OpenAPI documentation is implemented to provide:

* Interactive API testing
* Endpoint documentation
* Request/response schema visualization
* Authentication testing support

The Swagger UI allows developers and frontend teams to easily understand and integrate the backend APIs.

---

# Expected Outcomes

By completing this project, the following outcomes are achieved:

* Understanding of RESTful API development
* Experience with backend architecture design
* Practical implementation of authentication systems
* Knowledge of MongoDB schema modeling
* API documentation experience using Swagger
* Understanding of middleware and error handling
* Experience with production-style backend workflows

---

# Conclusion

This project demonstrates the implementation of a modern E-Commerce backend system using Node.js, TypeScript, and MongoDB. The backend architecture focuses on scalability, modularity, security, and maintainability while following industry-standard REST API development practices.

The developed APIs provide a strong foundation for integration with frontend web applications, mobile applications, or third-party services.
