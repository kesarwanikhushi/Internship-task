# Task Manager API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-api-domain.com/api
```

## Authentication
Most endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 📝 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Creates a new user account and sends OTP to email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "message": "Registration successful! Please check your email for the OTP.",
  "email": "john@example.com",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Error Responses:**
- `400`: Missing fields, invalid email, or password too short
- `500`: Email sending failed or server error

---

### 2. Verify OTP
**POST** `/auth/verify-otp`

Verifies email with OTP and returns access/refresh tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "Email verified successfully!",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400`: Invalid or expired OTP
- `404`: User not found

---

### 3. Resend OTP
**POST** `/auth/resend-otp`

Resends OTP to user's email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "OTP resent successfully!"
}
```

**Error Responses:**
- `400`: Email already verified
- `404`: User not found

---

### 4. Login
**POST** `/auth/login`

Authenticates user and returns tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `403`: Email not verified (requires verification)

---

### 5. Refresh Token
**POST** `/auth/refresh-token`

Gets a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Refresh token required
- `401`: Invalid or expired refresh token

---

### 6. Logout
**POST** `/auth/logout`

Invalidates refresh token. Requires authentication.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 👤 User Endpoints

### 1. Get Current User Profile
**GET** `/users/me`

Returns authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-01-15T10:30:00.000Z"
}
```

---

### 2. Update User Profile
**PUT** `/users/me`

Updates authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Smith"
}
```

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Smith",
  "email": "john@example.com"
}
```

---

## ✅ Task Endpoints

### 1. Get All Tasks
**GET** `/tasks`

Returns all tasks for authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (todo, in-progress, completed)
- `priority` (optional): Filter by priority (low, medium, high)
- `search` (optional): Search in title and description

**Example:**
```
GET /tasks?status=in-progress&priority=high
```

**Success Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Complete project",
    "description": "Finish the task manager app",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-01-20T00:00:00.000Z",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T12:00:00.000Z"
  }
]
```

---

### 2. Get Single Task
**GET** `/tasks/:id`

Returns a specific task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Complete project",
  "description": "Finish the task manager app",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-01-20T00:00:00.000Z"
}
```

**Error Responses:**
- `404`: Task not found

---

### 3. Create Task
**POST** `/tasks`

Creates a new task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2026-01-25T00:00:00.000Z"
}
```

**Success Response (201):**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "title": "New Task",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2026-01-25T00:00:00.000Z",
  "createdAt": "2026-01-15T14:00:00.000Z"
}
```

---

### 4. Update Task
**PUT** `/tasks/:id`

Updates an existing task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Updated Task",
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Updated Task",
  "status": "completed",
  "updatedAt": "2026-01-15T15:00:00.000Z"
}
```

---

### 5. Delete Task
**DELETE** `/tasks/:id`

Deletes a task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Responses:**
- `404`: Task not found

---

## 📊 Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## 🔐 Security Notes

1. **Access Token**: Short-lived (15 minutes), use for API requests
2. **Refresh Token**: Long-lived (7 days), use to get new access tokens
3. **OTP**: Valid for 10 minutes, 6-digit numeric code
4. **Passwords**: Minimum 6 characters, hashed with bcrypt
5. **Email Validation**: Strict format validation using validator.js

---

## 📋 Rate Limiting

(To be implemented in production)

- Authentication endpoints: 5 requests per minute
- API endpoints: 100 requests per minute per user

---

## 🧪 Testing the API

### Using cURL:

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Tasks:**
```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📦 Postman Collection

Import the `postman_collection.json` file into Postman for ready-to-use API requests.

**Steps:**
1. Open Postman
2. Click "Import"
3. Select `postman_collection.json`
4. Set environment variables:
   - `base_url`: http://localhost:5000/api
   - `access_token`: (auto-populated after login)
