# Backend - Task Management API

Node.js + Express backend for the Task Management application.

## Features

- User authentication (register/login)
- JWT token-based authorization
- Task CRUD operations
- User profile management
- MongoDB database integration
- Error handling and logging

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/internship_task_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (protected)

### Tasks
- GET `/api/tasks` - Get all tasks (protected)
- GET `/api/tasks/:id` - Get single task (protected)
- POST `/api/tasks` - Create task (protected)
- PUT `/api/tasks/:id` - Update task (protected)
- DELETE `/api/tasks/:id` - Delete task (protected)

### Profile
- GET `/api/profile` - Get user profile (protected)
- PUT `/api/profile` - Update profile (protected)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── profileController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── profileRoutes.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── logger.js
│   │   └── validator.js
│   ├── app.js
│   └── server.js
├── logs/
│   ├── server.log
│   └── error.log
├── .env
└── package.json
```
