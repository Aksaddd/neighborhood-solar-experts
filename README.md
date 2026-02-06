# Neighborhood Solar Experts

**Live site:** [neighborhoodsolarexpert.energy](https://neighborhoodsolarexpert.energy)

A professional solar energy website with a client management backend and admin dashboard. Built for Neighborhood Solar Experts to capture leads, manage client data, and create solar estimates.

## Features

- **Landing page** with hero video, about section, services, process breakdown, and contact form
- **Contact form** that captures client info (name, email, phone, ZIP, monthly bill) and saves it to the database
- **Admin dashboard** at `/admin` for managing leads, updating client status, adding notes, and creating estimates
- **JWT authentication** for secure admin access
- **Responsive design** with a "Quiet Luxury" aesthetic using Playfair Display font

## Tech Stack

- **Frontend:** React 18, Vite
- **Backend:** Express.js, Node.js
- **Database:** SQLite via sql.js (pure JavaScript — no native dependencies)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Hosting:** Render (with persistent disk for database storage)
- **Domain:** Namecheap (neighborhoodsolarexpert.energy)

## Project Structure

```
neighborhood-solar-experts/
├── neighborhood-solar-experts.jsx   # Main React app (all pages/components)
├── index.html                       # Vite entry point
├── src/main.jsx                     # React mount point
├── vite.config.js                   # Vite config with dev proxy
├── server/
│   ├── index.js                     # Express server entry point
│   ├── db.js                        # SQLite database (sql.js wrapper)
│   ├── auth.js                      # JWT middleware
│   ├── seed-admin.js                # Creates default admin account
│   └── routes/
│       ├── auth.js                  # Login, password change, token verify
│       ├── clients.js               # Client CRUD (public form + admin)
│       └── estimates.js             # Estimate CRUD (admin only)
├── admin/
│   └── index.html                   # Admin dashboard (self-contained)
├── public/
│   └── hero-video.mp4               # Hero section background video
├── render.yaml                      # Render deployment blueprint
└── package.json
```

## Local Development

```bash
# Install dependencies
npm install

# Start the backend server (port 3001)
npm run server

# In a separate terminal, start the frontend dev server (port 5173)
npm run dev

# Seed the default admin account
npm run seed-admin
```

Visit `http://localhost:5173` for the site and `http://localhost:5173/admin` for the admin dashboard.

## Admin Dashboard

- **URL:** `https://neighborhoodsolarexpert.energy/admin`
- **Default credentials:** username `admin` / password `changeme123`
- Change the password after first login via the Settings tab

### Admin Features

- View all client submissions with search and status filtering
- Click a client to see full details
- Update client status: New → Contacted → Qualified
- Add notes to client records
- Create solar estimates (system size, panel count, savings, incentives)
- Change admin password

## Deployment (Render)

The site is deployed on [Render](https://render.com) with:

- **Build command:** `npm install && npm run build && npm run seed-admin`
- **Start command:** `node server/index.js`
- **Persistent disk** (1GB at `/var/data`) for SQLite database storage
- **Environment variables:**
  - `NODE_ENV=production`
  - `JWT_SECRET` (auto-generated)
  - `DATA_DIR=/var/data`

## Domain Setup (Namecheap)

DNS records pointing to Render:

| Type | Host | Value |
|------|------|-------|
| A Record | @ | 216.24.57.1 |
| CNAME | www | neighborhood-solar-experts.onrender.com |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/clients` | Public | Submit contact form |
| GET | `/api/clients` | Admin | List all clients |
| GET | `/api/clients/:id` | Admin | Get client details + estimates |
| PATCH | `/api/clients/:id` | Admin | Update client fields |
| DELETE | `/api/clients/:id` | Admin | Delete client |
| POST | `/api/estimates` | Admin | Create estimate for a client |
| GET | `/api/estimates/:id` | Admin | Get estimate details |
| PATCH | `/api/estimates/:id` | Admin | Update estimate |
| DELETE | `/api/estimates/:id` | Admin | Delete estimate |
| POST | `/api/auth/login` | Public | Admin login |
| POST | `/api/auth/change-password` | Admin | Change password |
| GET | `/api/auth/me` | Admin | Verify token |
| GET | `/api/health` | Public | Health check |
