# Vercel Deployment Guide

## Backend Deployment Issues Fixed

The following issues have been resolved for Vercel deployment:

### 1. **Route Configuration**
- ✅ Updated `vercel.json` to properly handle serverless functions
- ✅ Added `/api` prefix to all backend routes
- ✅ Added health check endpoints at `/` and `/api`

### 2. **API Endpoints**
All backend routes now use the `/api` prefix:
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/users/profile` - Get/Update user profile
- `/api/tasks` - Task CRUD operations

### 3. **Frontend API Calls**
- ✅ Updated all frontend API calls to include `/api` prefix
- ✅ Uses environment variable `VITE_API_URL` for backend URL

## Deployment Steps

### Backend (Vercel)

1. **Push your code to GitHub** (if not already done)

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import your repository

3. **Configure Project**
   - Root Directory: `backend`
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

4. **Set Environment Variables**
   Go to Settings → Environment Variables and add:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-backend.vercel.app`)

### Frontend (Vercel/Netlify)

1. **Create `.env.production` file** in the `frontend` folder:
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```

2. **Deploy to Vercel**
   - Click "Add New Project"
   - Import your repository
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   
3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live!

## Testing Your Deployment

1. **Test Backend Health Check**
   ```
   curl https://your-backend.vercel.app/api
   ```
   Should return: `{"message":"Task Management API is running","status":"ok"}`

2. **Test Frontend**
   - Open your frontend URL
   - Try registering a new user
   - Create and manage tasks

## Common Issues & Solutions

### Issue: CORS errors
**Solution**: The backend already has CORS enabled. Make sure you're using the correct backend URL in your frontend environment variables.

### Issue: 500 Internal Server Error
**Solution**: Check your environment variables in Vercel dashboard, especially `MONGODB_URI` and `JWT_SECRET`.

### Issue: Routes not found (404)
**Solution**: Make sure you've deployed the latest code with all the `/api` prefix updates.

### Issue: Database connection fails
**Solution**: 
- Verify your MongoDB connection string is correct
- Make sure your MongoDB cluster allows connections from anywhere (0.0.0.0/0) or add Vercel IPs to allowlist

## Local Development

For local development, both backend and frontend should work as before:

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Make sure your local `.env` files are properly configured:
- `backend/.env` - MongoDB URI and JWT secret
- `frontend/.env` - API URL pointing to `http://localhost:5000`
