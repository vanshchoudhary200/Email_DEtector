# Suspicious Email Detector MERN Stack

A complete MERN project for checking suspicious email addresses. It includes React frontend, Express backend, MongoDB persistence, JWT authentication, user history, and an admin panel.

## Features

- Email syntax validation
- Temporary/disposable email domain detection
- DNS domain existence check with MX record lookup
- Risk score and risk level generation
- Authenticated history dashboard
- JWT login/register flow
- Role-protected admin panel
- Admin user seed script
- Clean frontend/backend folder structure

## Project Structure

```text
suspicious-email-detector-mern/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
  frontend/
    src/
      api/
      components/
      context/
      pages/
      styles/
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string
- Docker Desktop, if you want to run MongoDB with the included `docker-compose.yml`
- npm

## Step-by-Step Setup

1. Install dependencies from the project root:

   ```bash
   npm install
   npm run install:all
   ```

2. Configure the backend:

   ```bash
   cd backend
   cp .env.example .env
   ```

   On Windows PowerShell, use:

   ```powershell
   Copy-Item .env.example .env
   ```

   Update `backend/.env` if needed:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/suspicious_email_detector
   JWT_SECRET=replace_this_with_a_long_random_secret
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=Admin@12345
   ```

3. Configure the frontend:

   ```bash
   cd ../frontend
   cp .env.example .env
   ```

   On Windows PowerShell, use:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Start MongoDB.

   For local MongoDB, make sure the MongoDB service is running. For Atlas, replace `MONGO_URI` in `backend/.env`.

   Or run the included Docker MongoDB container:

   ```bash
   docker compose up -d mongo
   ```

5. Create the first admin user:

   ```bash
   cd ../backend
   npm run seed:admin
   ```

6. Run the app from the project root:

   ```bash
   npm run dev
   ```

7. Open the frontend:

   ```text
   http://localhost:5173
   ```

   Backend API health check:

   ```text
   http://localhost:5000/api/health
   ```

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Email Checks

- `POST /api/emails/check`
- `GET /api/emails/history`
- `DELETE /api/emails/history/:id`

### Admin

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/role`
- `GET /api/admin/checks`

## Risk Scoring Logic

The backend assigns points for suspicious indicators:

- Invalid syntax: high risk
- Known temporary email domain: high risk
- Domain does not resolve: high risk
- Domain resolves but lacks MX records: medium risk
- Long numeric or generated-looking local parts: low-to-medium risk

Scores are capped at 100 and mapped to `Low`, `Medium`, `High`, or `Critical`.

## Notes

- DNS checks require network/DNS access from the backend machine.
- The temporary domain list is stored in `backend/src/services/disposableDomains.js` and can be expanded.
- Admin access is controlled by the `role` field on users.
- The included GitHub Pages workflow deploys only the React frontend. The Express/MongoDB backend still needs a backend host such as Render, Railway, Fly.io, or an always-on server. Set the repository variable `VITE_API_URL` to your deployed backend API URL before using the Pages deployment publicly.

## Production Deployment

### Backend on Render

This repo includes `render.yaml` for a Render web service.

1. Create a MongoDB Atlas cluster and copy the connection string.
2. In Render, create a new Blueprint from this GitHub repository.
3. Set these Render environment variables:

   ```text
   MONGO_URI=<your MongoDB Atlas URI>
   CLIENT_URL=https://vanshchoudhary200.github.io/Email_DEtector
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=Admin@12345
   ```

4. After Render deploys, run the backend seed command once from Render Shell:

   ```bash
   npm run seed:admin
   ```

### Frontend on GitHub Pages

1. Open the repository settings on GitHub.
2. Go to **Pages**.
3. Set **Build and deployment** source to **GitHub Actions**.
4. Add a repository variable named `VITE_API_URL`:

   ```text
   https://your-render-service.onrender.com/api
   ```

5. Run the workflow named **Deploy Frontend to GitHub Pages**.
