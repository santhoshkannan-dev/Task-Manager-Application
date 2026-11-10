# TaskFlow Setup & Installation Guide

This document provides step-by-step instructions to set up, configure, and run the **TaskFlow** full-stack task management application locally.

---

## 1. System Requirements

Ensure you have the following installed on your operating system:
- **Node.js**: v18.0.0 or higher (Run `node -v` to verify)
- **npm**: v9.0.0 or higher (Run `npm -v` to verify)
- **PostgreSQL**: v14 or higher (Run `psql --version` or check PostgreSQL service)
- **Git**: (Run `git --version` to verify)

---

## 2. PostgreSQL Database Setup

1. Open your terminal or `psql` command line tool as the postgres superuser:
   ```bash
   psql -U postgres
   ```

2. Create the application database named `task_manager`:
   ```sql
   CREATE DATABASE task_manager;
   ```

3. Exit the `psql` console:
   ```sql
   \q
   ```

---

## 3. Backend Configuration & Startup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Copy the environment configuration template:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # Linux / macOS
   cp .env.example .env
   ```

3. Edit `backend/.env` with your PostgreSQL database credentials:
   ```env
   PORT=5000
   NODE_ENV=development

   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=task_manager
   DB_USER=postgres
   DB_PASSWORD=your_actual_password_here

   CLIENT_URL=http://localhost:3000
   ```

4. Install backend dependencies:
   ```bash
   npm install
   ```

5. Initialize the database schema (creates the `tasks` table and `updated_at` trigger):
   ```bash
   npm run db:init
   ```

6. (Optional) Seed the database with initial tasks:
   ```bash
   npm run db:seed
   ```

7. Start the Express backend server:
   ```bash
   # For development with nodemon hot-reload
   npm run dev

   # Or standard production start
   npm start
   ```

   The server will start at:
   - REST API Base: `http://localhost:5000/api`
   - Health Check: `http://localhost:5000/api/health`

---

## 4. Frontend Configuration & Startup

1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Copy the environment configuration template:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env.local

   # Linux / macOS
   cp .env.example .env.local
   ```

3. Verify that `frontend/.env.local` contains:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Install frontend dependencies:
   ```bash
   npm install
   ```

5. Start the Next.js development server:
   ```bash
   npm run dev
   ```

   Or to test the production build:
   ```bash
   npm run build
   npm start
   ```

6. Open your web browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

---

## 5. Verification & Testing Checklist

- [x] **Dashboard (`/`)**: Displays real counts for Total, Completed, Pending, and High Priority tasks.
- [x] **Create Task**: Click "Create New Task", fill out title, optional description, choose priority, and click Submit.
- [x] **All Tasks (`/tasks`)**: Search tasks, filter by priority or completion, switch between Grid and List views.
- [x] **Edit Task**: Click the pencil icon on any task card to edit its details.
- [x] **Toggle Completion**: Click the checkbox on any task card to toggle completion.
- [x] **Completed Archive (`/completed`)**: View all completed tasks and restore them back to pending backlog.
- [x] **Productivity Analytics (`/analytics`)**: View real Recharts visualizations derived from your database records.
- [x] **Settings (`/settings`)**: Check the live connection between Express and PostgreSQL.
- [x] **Delete Task**: Click the trash icon to open the confirmation modal and permanently remove the task.

---

## 6. Troubleshooting Common Issues

### Issue: "password authentication failed for user 'postgres'"
- **Cause**: Incorrect database credentials in `backend/.env`.
- **Solution**: Open `backend/.env` and update `DB_PASSWORD` to match your local PostgreSQL superuser password.

### Issue: "relation 'tasks' does not exist"
- **Cause**: Database schema was not initialized.
- **Solution**: In the `backend` directory, run `npm run db:init`.

### Issue: Frontend fails to fetch tasks ("Failed to fetch")
- **Cause**: The backend server is not running or CORS is misconfigured.
- **Solution**: Ensure the Express backend is running on port 5000 by navigating to `http://localhost:5000/api/health` in your browser. Verify `CLIENT_URL=http://localhost:3000` is present in `backend/.env`.

