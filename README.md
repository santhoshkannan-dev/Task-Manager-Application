# TaskFlow - Premium Productivity SaaS

TaskFlow is a modern, production-grade SaaS Task Management application crafted with a focus on minimalism, aesthetic polish, and software architecture. It delivers a fast, responsive user experience powered by **Next.js 14**, a decoupled **Express.js REST API**, and a robust **PostgreSQL** relational database.

---

## 📸 Design Direction & Highlights

- **Visual Inspiration**: Soft lavender and pure white cards with crisp charcoal typography (`#1E1B2E`).
- **Signature Branding**: Violet/Purple primary accent (`#7050DC`), warm amber secondary accents (`#F5A623`), and emerald success indicators.
- **Micro-Interactions**: Smooth state transitions, interactive progress indicators, intuitive modal workflows, and responsive drawers for mobile and tablet users.
- **Enterprise-Ready Architecture**: Strict separation of concerns, parameterized SQL queries, centralized error handling, and live database-backed analytics.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom SaaS color palette & shadows
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Forms & Validation**: React Hook Form with Zod schema validation
- **Notifications**: Sonner toasts
- **Date Utilities**: date-fns

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database Client**: `pg` (node-postgres connection pool)
- **Environment Management**: `dotenv`
- **Cross-Origin Resource Sharing**: `cors`
- **Development Tooling**: `nodemon`

### Database
- **Engine**: PostgreSQL 14+ (tested on PostgreSQL 18)
- **Table Schema**: Parameterized `tasks` table with automated `updated_at` trigger

---

## 📂 Project Architecture

```
task-manager/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Overview Dashboard
│   │   │   ├── layout.tsx             # Root layout with Toaster & AppShell
│   │   │   ├── globals.css            # Custom CSS & Tailwind base
│   │   │   ├── tasks/page.tsx         # All Tasks (Search, Filter, Grid/List)
│   │   │   ├── completed/page.tsx     # Completed Tasks Archive & Restore
│   │   │   ├── analytics/page.tsx     # Productivity Analytics (Recharts)
│   │   │   └── settings/page.tsx      # System health & Preferences
│   │   ├── components/
│   │   │   ├── layout/                # Sidebar, TopNav, MobileNav, AppShell
│   │   │   ├── dashboard/             # StatCard, TaskProgress, RecentTasks
│   │   │   ├── tasks/                 # TaskCard, TaskModal, DeleteConfirmModal, TaskFilters
│   │   │   ├── charts/                # PriorityDistributionChart, TaskCompletionChart
│   │   │   └── ui/                    # Button, Badge, Modal, Skeleton, EmptyState
│   │   ├── services/
│   │   │   └── api.ts                 # Centralized Typed API Client
│   │   ├── types/
│   │   │   └── index.ts               # Shared TypeScript Interfaces
│   │   └── lib/
│   │       └── utils.ts               # Tailwind merge & date formatters
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── taskController.js      # CRUD & Statistics business logic
│   │   ├── routes/
│   │   │   └── taskRoutes.js          # REST endpoints
│   │   ├── middleware/
│   │   │   ├── errorHandler.js        # Global error & 404 handler
│   │   │   └── validateRequest.js     # Parameter validators
│   │   ├── validators/
│   │   │   └── taskValidator.js       # Zod-style strict request validation
│   │   ├── db/
│   │   │   ├── index.js               # PostgreSQL connection pool
│   │   │   ├── init.js                # Schema migrations & trigger
│   │   │   └── seed.js                # Sample tasks seeder
│   │   └── server.js                  # Express app entrypoint
│   ├── .env.example
│   └── package.json
│
├── README.md
├── SETUP.md
└── .gitignore
```

---

## 📋 Features

1. **Overview Dashboard**:
   - Personalized welcome banner: *"Good morning, welcome back!"*
   - Live KPI cards: Total Tasks, Completed Tasks, Pending Tasks, and High Priority Tasks calculated directly from PostgreSQL.
   - Dynamic completion progress bar with percentage indicator.
   - Recent tasks stream with quick inline status toggles.
2. **All Tasks Management**:
   - Real-time search across task titles and descriptions.
   - Priority filter pills (`HIGH`, `MEDIUM`, `LOW`, or `ALL`).
   - Status filters (`COMPLETED`, `PENDING`, or `ALL`).
   - Sorting by `newest`, `oldest`, or `priority`.
   - Grid and List view switcher.
3. **Task Modal (Create & Edit)**:
   - Built with React Hook Form and Zod.
   - Visual priority level selector.
   - Duplicate submission protection and clear error feedback.
4. **Completed Tasks Archive**:
   - Dedicated view for finished deliverables.
   - One-click restore to pending backlog using the PATCH endpoint.
5. **Productivity Analytics**:
   - Recharts visual charts powered by database counts.
   - Priority distribution bar chart and completed vs pending donut chart.
6. **Settings & Architecture Diagnostics**:
   - Live health check pinging the Express REST API and PostgreSQL database connection pool.

---

## 🔌 API Endpoints Documentation

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/health` | Health check verifying Express server and PostgreSQL connectivity | `200`, `500` |
| `GET` | `/api/tasks` | Retrieve tasks with optional `search`, `priority`, `completed`, and `sort` query params | `200`, `500` |
| `GET` | `/api/tasks/stats/summary` | Retrieve aggregate counts for dashboard and analytics | `200`, `500` |
| `GET` | `/api/tasks/:id` | Fetch a single task by its integer ID | `200`, `400`, `404`, `500` |
| `POST` | `/api/tasks` | Create a new task (`title` required, `description`, `priority`) | `201`, `400`, `500` |
| `PUT` | `/api/tasks/:id` | Update an existing task's fields | `200`, `400`, `404`, `500` |
| `PATCH` | `/api/tasks/:id/complete` | Toggle or set task completion status | `200`, `400`, `404`, `500` |
| `DELETE` | `/api/tasks/:id` | Permanently delete a task from the database | `200`, `400`, `404`, `500` |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v26)
- **PostgreSQL** v14+ running locally or remotely

### 2. Database Setup
Create the PostgreSQL database:
```sql
CREATE DATABASE task_manager;
```

### 3. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials (DB_USER, DB_PASSWORD, DB_PORT)

npm install
npm run db:init      # Creates the tasks table and updated_at trigger
npm run db:seed      # (Optional) Seeds sample tasks
npm run dev          # Starts Express server on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd frontend
cp .env.example .env.local
# Verify NEXT_PUBLIC_API_URL=http://localhost:5000/api

npm install
npm run dev          # Starts Next.js on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Best Practices

- **Zero Secret Commits**: Environment files (`.env`, `.env.local`) are strictly excluded via `.gitignore`.
- **SQL Injection Prevention**: 100% of SQL queries use parameterized arguments (`$1`, `$2`, etc.).
- **Strict Validation**: Both client-side (Zod) and server-side validators reject invalid inputs and priority values.
- **Production-Safe Error Handling**: Internal database stack traces are sanitized before sending responses to clients.

