# AI Tooling Prompts Log - Car Dealership Inventory System

This document contains a running log of prompts and instructions provided to AI tooling (Antigravity) during the development of the Car Dealership Inventory System.

---

## Step 1: Create the Project & Directory Structure
**Prompt:**
> Create a GitHub repository and initialize project structure with backend/, frontend/, README.md, PROMPTS.md, and .gitignore.

**Actions:**
- Initialized root `.gitignore`, empty directories for `backend/` and `frontend/`.
- Created `PROMPTS.md` and initial `README.md`.
- Executed git commit: `chore: initialize project structure`.

---

## Step 2: FastAPI Boilerplate Generation
**Prompt:**
> Create a FastAPI backend project for a Car Dealership Inventory System. Use Python 3.12, FastAPI, SQLAlchemy ORM, Alembic migrations, PostgreSQL, Pydantic v2, JWT authentication, Passlib for password hashing, and Pytest for testing. Organize the project into routers, models, schemas, services, database, authentication, and tests folders following clean architecture and SOLID principles.

---

## Step 3: Database Connection
**Prompt:**
> Configure PostgreSQL connection using SQLAlchemy and environment variables. Add Alembic migration support. Create Base model and database session dependency.

---

## Step 4: User Model
**Prompt:**
> Create SQLAlchemy User model with id, username, email, hashed_password, role (user/admin), created_at. Create matching Pydantic schemas. Write tests first.

---

## Step 5: Authentication
**Prompt:**
> Implement JWT authentication including Register and Login APIs. Hash passwords using Passlib bcrypt. Return JWT access token after successful login. Protect routes using OAuth2PasswordBearer.

Endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`

---

## Step 6: Vehicle Model
**Prompt:**
> Create Vehicle model with id, make, model, category, price, quantity, created_at and updated_at. Generate SQLAlchemy model, schemas and migration.

---

## Step 7: CRUD APIs
**Prompt:**
> Create REST APIs for vehicles:
> - Add Vehicle (`POST /api/vehicles`)
> - List Vehicles (`GET /api/vehicles`)
> - Update Vehicle (`PUT /api/vehicles/{id}`)
> - Delete Vehicle (Admin only) (`DELETE /api/vehicles/{id}`)

---

## Step 8: Search API
**Prompt:**
> Implement GET /api/vehicles/search supporting make, model, category, minimum price and maximum price filters. Support multiple filters simultaneously.

---

## Step 9: Purchase API
**Prompt:**
> Implement Purchase API that decreases vehicle quantity by one. Return validation error if quantity becomes negative. (`POST /api/vehicles/{id}/purchase`)

---

## Step 10: Restock API
**Prompt:**
> Implement Restock API (`POST /api/vehicles/{id}/restock`). Only Admin users can increase stock quantity.

---

## Step 11: Testing
**Prompt:**
> Write comprehensive Pytest test cases for authentication, CRUD, search, purchase and restock APIs. Cover successful and failure scenarios.

---

## Step 12: React Project Setup
**Prompt:**
> Create a React application using Vite. Install Tailwind CSS, React Router and Axios. Organize project into components, pages, services, hooks and context folders.

---

## Step 13: Login & Register UI
**Prompt:**
> Create responsive Login and Register pages using Tailwind CSS. Connect to FastAPI authentication APIs using Axios. Store JWT token securely and redirect after login.

---

## Step 14: Dashboard
**Prompt:**
> Create dashboard showing all vehicles in responsive cards. Display make, model, category, price and quantity.

---

## Step 15: Search UI
**Prompt:**
> Add search filters for make, model, category and price range. Call backend search API while typing.

---

## Step 16: Purchase Button UI
**Prompt:**
> Add Purchase button for every vehicle. Disable button when quantity equals zero. Refresh inventory after purchase.

---

## Step 17: Admin Panel UI
**Prompt:**
> Create Admin Dashboard with forms to Add, Update and Delete vehicles. Protect page so only admin users can access it.

---

## Phase 4: Deployment
**Prompt:**
> Prepare FastAPI backend for deployment on Render. Configure environment variables, CORS, production settings and PostgreSQL.
> Prepare React frontend for deployment on Vercel. Configure environment variables and production API URL.

---

## Phase 5: Documentation
**Prompt:**
> Write a professional README including project overview, technologies, installation, API endpoints, screenshots, deployment instructions, testing guide and project architecture.
