# Health Tracker (MERN)

## Features
- JWT auth with refresh-token cookie rotation
- User profile (age, weight, height, goal summary)
- Daily health logs (calories, water, steps/exercise, sleep)
- Goals CRUD
- Dashboard analytics (weekly/monthly) with charts
- Responsive UI (Tailwind)

## Prerequisites
- Node.js 18+
- MongoDB running locally or provide a remote `MONGO_URI`

## Backend

### 1) Configure environment
```powershell
cd .\backend
copy .env.example .env
```
Update:
- `MONGO_URI`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `FRONTEND_URL` (optional)

### 2) Install dependencies
```powershell
npm install
```

### 3) Seed demo data (optional but recommended)
```powershell
npm run seed
```
This inserts:
- demo user: `demo@healthtracker.com`
- demo password: `Password123!`

### 4) Start the API
```powershell
npm run dev
```
API base:
- `http://localhost:5000/api`

## Frontend

### 1) Configure environment
```powershell
cd ..\frontend
copy .env.example .env
```
Update:
- `VITE_API_URL=http://localhost:5000`

### 2) Install dependencies
```powershell
npm install
```

### 3) Start the web app
```powershell
npm run dev
```
Open:
- `http://localhost:5173`

## API Endpoints (high level)
- `POST /api/auth/register`, `POST /api/auth/login`
- `POST /api/auth/refresh` (uses refresh cookie)
- `POST /api/auth/logout`
- `GET /api/profile`, `PUT /api/profile`
- `POST /api/logs`, `GET /api/logs`
- `PUT /api/logs/:id`, `DELETE /api/logs/:id`
- `GET /api/logs/analytics?range=weekly|monthly`
- `POST /api/goals`, `GET /api/goals`
- `PUT /api/goals/:id`, `DELETE /api/goals/:id`

## Next improvements (optional)
- AI suggestions endpoint that summarizes weekly trends into actionable tips
- Notification/reminder system (cron + email/SMS) or in-app reminders
- Dark mode toggle (Tailwind `dark` class) and saved preference
- Background jobs for analytics snapshots and streak tracking

