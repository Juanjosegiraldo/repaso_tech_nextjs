# TechNova

CRUD application built with **Next.js 16 (App Router)**, **TypeScript**, **Mongoose** and
**MongoDB Atlas**. It manages two modules — **Users** and **Products** — with basic
authentication and client-side route protection.

## Features

- Users CRUD (`/admin/users`, admin only) with hashed passwords (bcrypt).
- Products CRUD (`/dashboard/products`) with SKU uniqueness and price/stock validation.
- Basic auth (login) + session stored in `localStorage` and route guards.
- Service layer in `src/services` — views never call `fetch` directly.
- Standard API envelope: `{ data, code, message }` with correct HTTP status codes.
- Optional: welcome email on sign-up, product filters, product detail with comments.

## Requirements

- **Node.js 18+**
- A **MongoDB Atlas** account (free M0 cluster is enough)

## Installation

```bash
git clone https://github.com/Juanjosegiraldo/repaso_tech_nextjs.git
cd technova
npm install
```

## Environment variables

Create a `.env.local` file in the project root (see `.env.example`):

```env
# MongoDB connection string (standard format works even if SRV DNS is blocked)
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/technova?retryWrites=true&w=majority

# Email (only needed for the welcome-email feature)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

> `.env.local` is git-ignored and must never be committed.

## Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # run the production build
```

Quick connection check: open `http://localhost:3000/api/health` → it should return
`{ "code": 200, "message": "DB Online" }`.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. In **Settings → Environment Variables**, add `MONGODB_URI` (and `EMAIL_USER`,
   `EMAIL_PASS` if you use email). `.env.local` is **not** uploaded, so you must set
   them again here.
4. **Deploy**.

> ⚠️ In MongoDB Atlas → **Network Access**, add `0.0.0.0/0` (Allow access from
> anywhere). Without it, Vercel's servers cannot reach your cluster.

## Author

- **Nombre:** Juan Jose Giraldo Muñoz
- **Clan:** Thompson
- **Correo:** juan.jo15@hotmail.com
- **Documento de identidad:** 1037662885
