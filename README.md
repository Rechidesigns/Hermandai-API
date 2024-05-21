# Authentication API with Node.js and Express
### Description
This project provides a robust authentication API built using Node.js and Express. It follows best practices for code organization, separation of concerns, and scalability.

## Features
User Registration: Create new user accounts securely.
Login and JWT Authentication: Authenticate users using JSON Web Tokens (JWT).
Password Hashing: Safely store user passwords using bcrypt.
Controllers, Helpers, and Models: Decoupled code for maintainability.
Error Handling Middleware: Handle errors gracefully.
Environment Variables: Use .env files for sensitive data.

### Installation
Clone this repository.
Run npm install to install dependencies.
Set up your environment variables (e.g., database connection, secret key).

### Usage
Start the server: npm start.
Register a new user via /api/register.
Obtain a JWT token via /api/login.
Access protected routes by including the token in the request headers.
