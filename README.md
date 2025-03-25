# User and Post Management API

## Overview

This project is a backend API built with **NestJS** and **Fastify**, designed for managing users, posts, comments, and categories while providing authentication, security, and social interactions such as likes and favorites.

## Features

### User Management

- User registration, login, and authentication.
- Account update and deletion.
- Password reset functionality.

### Post Management

- Create, edit, and delete posts.

### Comment Management

- Create, edit, and delete comments.
- Associate comments with posts and users.

### Category Management

- Create, edit, and delete categories.
- List posts by category.

### Social Features

- Like/unlike posts.
- Favorite posts.

### Search and Filtering

- Search posts by title and category.

## Technologies & Architecture

- **Backend Framework:** NestJS (using Fastify for performance optimization).
- **Database:** PostgreSQL.
- **ORM:** TypeORM.
- **Authentication & Security:**
  - Password hashing with bcrypt.
  - XSS protection using sanitizeHtml.
  - Environment variable management with dotenv.
- **API Documentation:** Swagger.
- **Validation:** DTOs with class-validator.

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/Andersoncrs5/blogSimple-nestjs.git
   cd project
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file based on `.env.example`.
   - Set database credentials
4. Start the application:
   ```sh
   npm run start:dev
   ```

## API Documentation

Swagger documentation is available at:

```
http://localhost:3000/api
```

## Contributing

Feel free to fork this project and submit pull requests with improvements or bug fixes.

## nest features

jwt
