# Deployment Guide

## Overview

This project consists of two separate applications:
- **Frontend**: React + Vite application (deploy to Vercel)
- **Backend**: Express.js + MongoDB API (deploy separately to Railway, Render, or similar)

## Why Separate Deployments?

Vercel is optimized for frontend applications and serverless functions. Traditional Express.js backends with persistent connections (like MongoDB) work better on platforms like:
- **Railway** (recommended - easy MongoDB integration)
- **Render** (free tier available)
- **Heroku** (paid)
- **DigitalOcean App Platform**

## Frontend Deployment (Vercel)

### Step 1: Configure Vercel Project Settings

1. Go to your Vercel project settings
2. In **General Settings** → **Root Directory**, set it to: `frontend`
3. In **Build & Development Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables

In Vercel project settings → **Environment Variables**, add:

```
VITE_API_URL=https://your-backend-url.com
```

Replace `https://your-backend-url.com` with your actual backend deployment URL (you'll get this after deploying the backend).

### Step 3: Deploy

The `vercel.json` file in the root directory is configured to handle the frontend deployment. After setting the root directory to `frontend` in Vercel settings, push your changes and Vercel will automatically deploy.

## Backend Deployment (Railway - Recommended)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 2: Deploy Backend

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your repository
3. Set the **Root Directory** to: `backend`
4. Railway will automatically detect it's a Node.js app

### Step 3: Add MongoDB Database

1. In your Railway project, click **"New"** → **"Database"** → **"MongoDB"**
2. Railway will automatically create a MongoDB instance
3. Copy the connection string (it will be in the MongoDB service's variables)

### Step 4: Configure Environment Variables

In your backend service on Railway, add these environment variables:

```
MONGODB_URI=<your-mongodb-connection-string-from-railway>
PORT=5000
NODE_ENV=production
```

### Step 5: Get Backend URL

1. Once deployed, Railway will provide a URL like: `https://your-app.railway.app`
2. Copy this URL
3. Go back to Vercel and update the `VITE_API_URL` environment variable with this URL
4. Redeploy the frontend

## Backend Deployment (Render - Alternative)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Deploy Backend

1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `herbs-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid)

### Step 3: Add MongoDB

1. Click **"New"** → **"MongoDB"**
2. Create a MongoDB instance
3. Copy the **Internal Database URL**

### Step 4: Configure Environment Variables

In your web service settings → **Environment**, add:

```
MONGODB_URI=<your-mongodb-internal-url>
PORT=5000
NODE_ENV=production
```

### Step 5: Get Backend URL

1. Render will provide a URL like: `https://your-app.onrender.com`
2. Update `VITE_API_URL` in Vercel with this URL

## Testing the Deployment

1. **Test Backend**: Visit `https://your-backend-url.com/api/health` - should return `{"success": true, "message": "Server is running"}`
2. **Test Frontend**: Visit your Vercel URL - should load the herbs collection
3. **Check Browser Console**: Make sure there are no CORS errors

## Troubleshooting

### 404 Error on Vercel

- Make sure **Root Directory** is set to `frontend` in Vercel project settings
- Verify `vercel.json` exists in the root directory
- Check that the build completed successfully

### CORS Errors

- Make sure your backend has CORS enabled (it should - check `backend/src/app.js`)
- Verify the `VITE_API_URL` environment variable is set correctly in Vercel
- Ensure the backend URL doesn't have a trailing slash

### API Connection Issues

- Verify `VITE_API_URL` is set in Vercel environment variables
- Check that the backend is deployed and accessible
- Test the backend health endpoint directly
- Check browser console for specific error messages

## Local Development

For local development, create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

The frontend will automatically use `http://localhost:5000` if `VITE_API_URL` is not set.

