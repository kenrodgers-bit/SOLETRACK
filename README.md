# SoleTrack - Shoe Shop Inventory PWA

SoleTrack is a full-stack, mobile-first Progressive Web App for shoe shop inventory and sales management. It supports admin/staff authentication, stock by shoe size, low-stock alerts, sales recording, Cloudinary image uploads, and Android-style PWA install.

## Production URLs

- Frontend PWA: https://soletrack-snowy.vercel.app
- Live API: https://soletrack-api.vercel.app/api/health
- GitHub repo: https://github.com/kenrodgers-bit/SOLETRACK

The frontend production environment uses:

```env
VITE_API_BASE_URL=https://soletrack-api.vercel.app
```

## Project Structure

```txt
backend/
frontend/
render.yaml
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Required backend environment:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=soletrack
MONGO_DB_NAME=soletrack
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

`DNS_SERVERS=8.8.8.8,1.1.1.1` is optional and useful on local Windows networks where Node cannot resolve MongoDB Atlas SRV records.

Seed or reset the production admin:

```bash
ADMIN_NAME="SoleTrack Admin" \
ADMIN_EMAIL="admin@soletrack.app" \
ADMIN_PASSWORD="use-a-strong-password" \
ADMIN_RESET=true \
NODE_ENV=production \
npm run seed:admin
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev -- --host 0.0.0.0
```

Required frontend environment:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Build and preview:

```bash
npm run build
npm run preview
```

## Deployment

### Frontend on Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Production env: `VITE_API_BASE_URL=https://soletrack-api.vercel.app`

### Backend

The backend can run as:

- A Node web service on Render using `render.yaml`
- A Vercel serverless API using `backend/api/index.js`

Render settings:

- Root: repo root when using Blueprint, or `backend` when creating a service manually
- Build command: `cd backend && npm ci`
- Start command: `cd backend && npm start`
- Health check: `/api/health`

Required production backend env vars:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=<MongoDB Atlas connection string>
MONGO_DB_NAME=soletrack
JWT_SECRET=<strong random secret>
FRONTEND_URL=https://soletrack-snowy.vercel.app
CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
CLOUDINARY_API_KEY=<Cloudinary API key>
CLOUDINARY_API_SECRET=<Cloudinary API secret>
```

Cloudinary credentials are required for file uploads. Admins can still save an externally hosted image URL directly when Cloudinary is not configured.

## PWA Install

Open the frontend URL in Chrome on Android, then use **Install app** or **Add to Home screen**. SoleTrack launches in standalone mode with the generated service worker and manifest.
