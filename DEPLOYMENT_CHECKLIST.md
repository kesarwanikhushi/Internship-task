# Deployment Checklist

## ✅ Changes Made

### Backend
- [x] Updated `vercel.json` with correct routing configuration
- [x] Added health check endpoints at `/` and `/api`
- [x] Prefixed all routes with `/api`:
  - `/api/auth/*` for authentication
  - `/api/users/*` for user operations
  - `/api/tasks/*` for task operations
- [x] Created `.env.example` file with required environment variables

### Frontend
- [x] Updated all API calls to use `/api` prefix:
  - AuthContext: `/api/auth/login`, `/api/auth/register`, `/api/users/profile`
  - Dashboard: `/api/tasks`
  - TaskForm: `/api/tasks`
  - TaskList: `/api/tasks/:id`
  - Profile: `/api/users/profile`
  - ProfileDropdown: `/api/users/profile`
  - KanbanBoard: `/api/tasks/:id`
- [x] Updated `.env.example` with deployment instructions

## 📋 Before Deploying

### Backend Environment Variables (Vercel)
Make sure these are set in your Vercel project:
- [ ] `MONGODB_URI` - Your MongoDB connection string
- [ ] `JWT_SECRET` - Your JWT secret key
- [ ] `NODE_ENV=production`

### Frontend Environment Variables (Vercel)
- [ ] `VITE_API_URL` - Your deployed backend URL (e.g., https://your-backend.vercel.app)

## 🚀 Deployment Steps

1. **Deploy Backend First**
   - Push code to GitHub
   - Import to Vercel
   - Set root directory to `backend`
   - Add environment variables
   - Deploy and copy the backend URL

2. **Deploy Frontend**
   - Import to Vercel (or use same project with different deployment)
   - Set root directory to `frontend`
   - Add `VITE_API_URL` environment variable with backend URL
   - Deploy

3. **Test**
   - Visit backend URL + `/api` (should show "API is running")
   - Visit frontend URL
   - Test registration, login, and task creation

## 🔍 What Was Fixed

The main issue was that Vercel serverless functions require all routes to be prefixed with `/api` when deployed. The previous configuration had:
- Routes without the `/api` prefix
- No health check endpoint (Vercel needs this to verify deployment)
- Frontend making calls to routes without the `/api` prefix

All of these have been corrected, so your backend will now work properly on Vercel!
