# AI Tooling Prompts & Development Trail Log - Car Dealership Inventory System

This document maintains a transparent running log of all prompt instructions and development steps provided to Antigravity AI during the design and construction of the Car Dealership Inventory System.

---

## Step 1: Create the Project & Directory Structure
**Prompt:**
> Create a GitHub repository and initialize project structure with backend/, frontend/, README.md, PROMPTS.md, and .gitignore.

**Actions Taken:**
- Created root `.gitignore`, `PROMPTS.md`, and initial `README.md`.
- Initialized local Git repository and set remote `https://github.com/kavan202/car_dealership_inventory.git`.
- Executed commit: `chore: initialize project structure`.

---

## Step 2: FastAPI Backend Project Setup
**Prompt:**
> Create a FastAPI backend project for a Car Dealership Inventory System. Use Python 3.12, FastAPI, SQLAlchemy ORM, Alembic migrations, PostgreSQL, Pydantic v2, JWT authentication, Passlib for password hashing, and Pytest for testing. Organize the project into routers, models, schemas, services, database, authentication, and tests folders following clean architecture and SOLID principles.

**Actions Taken:**
- Built Python virtual environment and installed FastAPI, Uvicorn, SQLAlchemy, Alembic, Pydantic v2, email-validator, PyJWT, Passlib (bcrypt), psycopg2-binary, and Pytest.
- Structure created in `backend/app/` (`config.py`, `database.py`, `auth.py`, `models/`, `schemas/`, `services/`, `routers/`).
- Executed commit: `chore: setup FastAPI project`.

---

## Step 3: Database Connection & Migrations
**Prompt:**
> Configure PostgreSQL connection using SQLAlchemy and environment variables. Add Alembic migration support. Create Base model and database session dependency.

**Actions Taken:**
- Configured PostgreSQL connection string (`postgresql://postgres:admin123@localhost:5432/car_inventory`).
- Initialized Alembic migrations and created initial migration `9c9904024dc9_create_user_and_vehicle_tables`.
- Applied migrations with `alembic upgrade head`.
- Executed commit: `feat: configure PostgreSQL database`.

---

## Step 4: User Model & Schemas (TDD)
**Prompt:**
> Create SQLAlchemy User model with id, username, email, hashed_password, role (user/admin), created_at. Create matching Pydantic schemas. Write tests first.

**Actions Taken:**
- Authored Pytest tests in `backend/tests/test_user_model.py`.
- Defined `User` SQLAlchemy model and `UserBase`, `UserCreate`, `UserResponse`, `Token` Pydantic schemas.
- Executed commits:
  1. `test: add user model tests`
  2. `feat: implement user model`

---

## Step 5: Authentication APIs & Security
**Prompt:**
> Implement JWT authentication including Register and Login APIs. Hash passwords using Passlib bcrypt. Return JWT access token after successful login. Protect routes using OAuth2PasswordBearer.

**Actions Taken:**
- Built `app/auth.py` and `UserService` for password hashing and JWT token generation.
- Added `/api/auth/register` and `/api/auth/login` endpoints.
- Authored Pytest suite in `backend/tests/test_auth.py`.
- Executed commits:
  1. `test: authentication endpoints`
  2. `feat: JWT authentication`

---

## Step 6: Vehicle Model
**Prompt:**
> Create Vehicle model with id, make, model, category, price, quantity, created_at and updated_at. Generate SQLAlchemy model, schemas and migration.

**Actions Taken:**
- Built `Vehicle` model in `app/models/vehicle.py`.
- Defined Pydantic schemas (`VehicleCreate`, `VehicleUpdate`, `VehicleResponse`, `VehicleRestock`) in `app/schemas/vehicle.py`.
- Executed commit: `feat: vehicle model`.

---

## Step 7: CRUD REST APIs
**Prompt:**
> Create REST APIs for vehicles: Add Vehicle, List Vehicles, Update Vehicle, Delete Vehicle (Admin only).

**Actions Taken:**
- Created `VehicleService` and `vehicle_router.py` with endpoints:
  - `POST /api/vehicles` (Add vehicle)
  - `GET /api/vehicles` (List vehicles)
  - `GET /api/vehicles/{id}` (Get single vehicle)
  - `PUT /api/vehicles/{id}` (Update vehicle)
  - `DELETE /api/vehicles/{id}` (Delete vehicle - Admin protected)
- Executed commit: `feat: vehicle CRUD`.

---

## Step 8: Vehicle Search API
**Prompt:**
> Implement GET /api/vehicles/search supporting make, model, category, minimum price and maximum price filters. Support multiple filters simultaneously.

**Actions Taken:**
- Implemented `GET /api/vehicles/search` supporting multi-parameter queries.
- Executed commit: `feat: vehicle search`.

---

## Step 9: Purchase API
**Prompt:**
> Implement Purchase API that decreases vehicle quantity by one. Return validation error if quantity becomes negative.

**Actions Taken:**
- Added `POST /api/vehicles/{id}/purchase` returning 400 when inventory reaches 0.
- Executed commit: `feat: purchase vehicle`.

---

## Step 10: Restock API
**Prompt:**
> Implement Restock API. Only Admin users can increase stock quantity.

**Actions Taken:**
- Added `POST /api/vehicles/{id}/restock` protected by `get_current_admin_user` dependency.
- Executed commit: `feat: restock inventory`.

---

## Step 11: Comprehensive Backend Test Suite
**Prompt:**
> Write comprehensive Pytest test cases for authentication, CRUD, search, purchase and restock APIs. Cover successful and failure scenarios.

**Actions Taken:**
- Implemented 16 test cases in `backend/tests/test_vehicles.py`, `test_auth.py`, `test_user_model.py`.
- Verified 100% test pass rate with Pytest.
- Executed commit: `test: backend API coverage`.

---

## Step 12: React + Vite Frontend Setup
**Prompt:**
> Create a React application using Vite. Install Tailwind CSS, React Router and Axios. Organize project into components, pages, services, hooks and context folders.

**Actions Taken:**
- Initialized React Vite project in `frontend/`, configured Tailwind CSS, Lucide icons, React Router DOM v6, Axios API interceptors.
- Executed commit: `chore: setup React frontend`.

---

## Step 13: Login & Register UI
**Prompt:**
> Create responsive Login and Register pages using Tailwind CSS. Connect to FastAPI authentication APIs using Axios. Store JWT token securely and redirect after login.

**Actions Taken:**
- Built dark-mode glassmorphic `Login.jsx` and `Register.jsx` views with token storage and error handling.
- Executed commit: `feat: authentication UI`.

---

## Step 14: Vehicle Dashboard UI
**Prompt:**
> Create dashboard showing all vehicles in responsive cards. Display make, model, category, price and quantity.

**Actions Taken:**
- Built `Dashboard.jsx` and `VehicleCard.jsx` displaying inventory cards, stock badges, and status indicators.
- Executed commit: `feat: dashboard`.

---

## Step 15: Search & Filter UI
**Prompt:**
> Add search filters for make, model, category and price range. Call backend search API while typing.

**Actions Taken:**
- Created `SearchFilters.jsx` toolbar with real-time multi-criteria filtering.
- Executed commit: `feat: vehicle filtering`.

---

## Step 16: Interactive Purchase Button
**Prompt:**
> Add Purchase button for every vehicle. Disable button when quantity equals zero. Refresh inventory after purchase.

**Actions Taken:**
- Integrated purchase click handler with real-time stock decrements and toast alerts.
- Executed commit: `feat: purchase UI`.

---

## Step 17: Admin Management Panel
**Prompt:**
> Create Admin Dashboard with forms to Add, Update and Delete vehicles. Protect page so only admin users can access it.

**Actions Taken:**
- Built `AdminPanel.jsx`, `VehicleModal.jsx`, `RestockModal.jsx` for Admin CRUD and inventory restocking.
- Executed commit: `feat: admin dashboard`.

---

## Step 20: Documentation & AI Transparency
**Prompt:**
> Write a professional README including project overview, technologies, installation, API endpoints, screenshots, deployment instructions, testing guide and project architecture.

**Actions Taken:**
- Created comprehensive `README.md` and complete `PROMPTS.md`.
- Executed final commit: `chore: complete documentation`.
