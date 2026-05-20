# SoleTrack — Shoe Shop Inventory PWA

SoleTrack is a full-stack, mobile-first Progressive Web App for shoe shops. It manages inventory by shoe size, records sales, deducts stock, alerts staff when stock is low, and installs on Android like a standalone app.

## Project Structure

```txt
soletrack-shoe-inventory/
├── backend
└── frontend
```

## Features

- Admin email/password login
- Staff 6-digit PIN login
- JWT protected API
- Admin-only staff manager
- Shoe inventory with sizes and quantities
- Cloudinary image upload
- Sales recording with automatic stock deduction
- Low-stock alerts
- Mobile-first PWA UI with bottom navigation
- Installable Android-style standalone app

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://your-mongodb-uri
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Create the first admin:

```bash
npm run seed:admin
```

Run backend:

```bash
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev -- --host 0.0.0.0
```

Open:

```txt
http://localhost:5173
```

## Android Native-Like Install

1. Deploy the frontend or open it from your local network on the phone.
2. Open the app in Chrome on Android.
3. Tap the menu ⋮.
4. Tap **Add to Home screen** or **Install app**.
5. Launch it from the home screen. It will open fullscreen without browser clutter.

## Deployment

### Backend on Render

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add backend environment variables from `.env.example`
- Set `FRONTEND_URL` to your Vercel frontend URL

### Frontend on Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_BASE_URL=https://your-render-backend.onrender.com`

## Notes

- Staff PINs are never displayed.
- Passwords and PINs are hashed with bcryptjs.
- Cloudinary image upload is optional for creating a shoe, but enabled for admin uploads.
- The app needs internet for backend/API operations, but the PWA shell can load from cache.
