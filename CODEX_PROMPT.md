# Refined Codex Prompt — SoleTrack Shoe Shop Inventory PWA

Build a production-ready full-stack mobile-first Progressive Web App named **SoleTrack** for a shoe shop.

## Goal
Create a phone-first inventory and sales system that installs like a native Android app, launches in standalone fullscreen PWA mode, manages shoe stock by size, records sales, deducts inventory, supports admin/staff authentication, and alerts staff when stock is low.

## Tech Stack
Use:
- Frontend: React, Vite, Tailwind CSS, React Router v6, Axios, Context API, vite-plugin-pwa
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, multer, Cloudinary SDK, CORS, dotenv
- Deployment targets: Frontend on Vercel, Backend on Render, images on Cloudinary

## Core Product Requirements
1. Mobile-first PWA with `display: standalone`, portrait orientation, installable icons, service worker, app manifest, and bottom navigation.
2. Auth modes:
   - Admin logs in using email + password.
   - Staff logs in using a 6-digit PIN.
   - JWT expires in 7 days.
   - Admin-only routes are protected by role middleware.
3. Shoe inventory:
   - Add, edit, delete shoes as Admin.
   - Staff can view inventory and record sales.
   - Each shoe has name, brand, category, sizes with quantity, buying price, selling price, low stock threshold, and Cloudinary image URL.
4. Sales:
   - Record sale by choosing shoe, size, and quantity.
   - Validate stock availability server-side.
   - Deduct stock atomically enough for small shop use.
   - Store snapshot fields: shoe name, unit price, sold by name, total amount.
5. Alerts:
   - Show all shoe sizes where quantity is less than or equal to the threshold.
   - Sort by most critical quantity first.
6. Dashboard:
   - Show total shoe models, total pairs in stock, low stock count, today's revenue, and recent sales.
7. Staff manager:
   - Admin can create, update, and delete staff users.
   - Staff PINs must be hashed and never displayed.
8. Image upload:
   - Admin uploads shoe image with multipart/form-data.
   - Backend temporarily stores via multer, uploads to Cloudinary, saves secure URL, deletes temp file.
   - Enforce 5MB file size limit.

## Required Folder Structure
Create:
```txt
shoe-inventory/
  backend/
    models/User.js
    models/Shoe.js
    models/Sale.js
    routes/auth.js
    routes/shoes.js
    routes/sales.js
    routes/staff.js
    middleware/authMiddleware.js
    middleware/roleMiddleware.js
    config/cloudinary.js
    scripts/seedAdmin.js
    uploads/.gitkeep
    server.js
    package.json
    .env.example
  frontend/
    public/icons/icon-192.png
    public/icons/icon-512.png
    src/api/axios.js
    src/context/AuthContext.jsx
    src/components/BottomNav.jsx
    src/components/ShoeCard.jsx
    src/components/StatCard.jsx
    src/components/AlertBadge.jsx
    src/components/SaleForm.jsx
    src/components/ProtectedRoute.jsx
    src/pages/Login.jsx
    src/pages/Dashboard.jsx
    src/pages/Inventory.jsx
    src/pages/AddEditShoe.jsx
    src/pages/LowStock.jsx
    src/pages/Sales.jsx
    src/pages/StaffManager.jsx
    src/App.jsx
    src/main.jsx
    src/index.css
    vite.config.js
    tailwind.config.js
    postcss.config.js
    package.json
    .env.example
  README.md
```

## UX Requirements
- Use clean white/gray surfaces, indigo accent, rounded cards, large touch targets, and safe-area bottom padding.
- Bottom nav fixed to bottom: Home, Inventory, Sales, Alerts, More.
- Hide bottom nav on login page.
- More opens links to Staff Manager for Admin and Logout for all users.
- Use mobile cards instead of horizontal tables where possible.
- Include empty states and loading states.
- Use KES formatting for money.

## API Requirements
Backend routes:
- `POST /api/auth/login`
- `GET /api/shoes`
- `GET /api/shoes/:id`
- `POST /api/shoes` Admin only
- `PUT /api/shoes/:id` Admin only
- `DELETE /api/shoes/:id` Admin only
- `POST /api/shoes/:id/upload` Admin only
- `GET /api/sales`
- `GET /api/sales/today`
- `POST /api/sales`
- `GET /api/staff` Admin only
- `POST /api/staff` Admin only
- `PUT /api/staff/:id` Admin only
- `DELETE /api/staff/:id` Admin only
- `GET /api/health`

## Security Requirements
- Hash passwords and PINs using bcryptjs with salt rounds of 10.
- Never return password or PIN hashes from API responses.
- Validate required fields and return clear error messages.
- Restrict CORS in production using `FRONTEND_URL`.
- Use dotenv for secrets.

## Deliverables
- Complete working source code.
- README with local setup, deployment steps, env variables, default admin creation, and Android install instructions.
- Package scripts that work:
  - Backend: `npm run dev`, `npm start`, `npm run seed:admin`
  - Frontend: `npm run dev -- --host 0.0.0.0`, `npm run build`, `npm run preview`
- Avoid nonexistent dependency versions. Use stable major versions only.
