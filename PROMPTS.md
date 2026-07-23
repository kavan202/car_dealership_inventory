# AI Tooling Prompts & Development Trail Log - Car Dealership Inventory System

This document maintains a transparent running log of all prompt instructions and development steps provided to Antigravity AI during the design and construction of the Car Dealership Inventory System.

---

## Step 1: Create the Project & Directory Structure
**Prompt:**
> Create a GitHub repository and initialize project structure with backend/, frontend/, README.md, PROMPTS.md, and .gitignore.

**Actions Taken:**
- Created root `.gitignore`, `PROMPTS.md`, and initial `README.md`.
- Initialized local Git repository and set remote `https://github.com/kavan202/car_dealership_inventory.git`.

---

## Step 2: FastAPI Backend Project Setup
**Prompt:**
> Create a FastAPI backend project for a Car Dealership Inventory System. Use Python 3.12, FastAPI, SQLAlchemy ORM, Alembic migrations, PostgreSQL, Pydantic v2, JWT authentication, Passlib for password hashing, and Pytest for testing. Organize the project into routers, models, schemas, services, database, authentication, and tests folders following clean architecture and SOLID principles.

**Actions Taken:**
- Built Python virtual environment and installed FastAPI, Uvicorn, SQLAlchemy, Alembic, Pydantic v2, email-validator, PyJWT, Passlib (bcrypt), psycopg2-binary, and Pytest.
- Structure created in `backend/app/` (`config.py`, `database.py`, `auth.py`, `models/`, `schemas/`, `services/`, `routers/`).

---

## Step 3: Database Connection & Migrations
**Prompt:**
> Configure PostgreSQL connection using SQLAlchemy and environment variables. Add Alembic migration support. Create Base model and database session dependency.

**Actions Taken:**
- Configured PostgreSQL connection string (`postgresql://postgres:admin123@localhost:5432/car_inventory`).
- Initialized Alembic migrations and applied schema migrations.

---

## Step 4: User Model & Schemas (TDD)
**Prompt:**
> Create SQLAlchemy User model with id, username, email, hashed_password, role (user/admin), created_at. Create matching Pydantic schemas. Write tests first.

**Actions Taken:**
- Authored Pytest tests in `backend/tests/test_user_model.py`.
- Defined `User` SQLAlchemy model and Pydantic schemas.

---

## Step 5: Authentication APIs & Security
**Prompt:**
> Implement JWT authentication including Register and Login APIs. Hash passwords using Passlib bcrypt. Return JWT access token after successful login. Protect routes using OAuth2PasswordBearer.

**Actions Taken:**
- Built `app/auth.py` and `UserService` for password hashing and JWT token generation.
- Added `/api/auth/register` and `/api/auth/login` endpoints.

---

## Step 6: Vehicle Model & Extended Attributes
**Prompt:**
> Create Vehicle model with id, make, model, category, price, quantity, color, fuel_type, created_at and updated_at. Generate SQLAlchemy model, schemas and migration.

**Actions Taken:**
- Built `Vehicle` model in `app/models/vehicle.py`.
- Added `color` and `fuel_type` attributes with Alembic migrations.

---

## Step 7: REST APIs & Multi-Criteria Search
**Prompt:**
> Create REST APIs for vehicles: Add Vehicle, List Vehicles, Update Vehicle, Delete Vehicle (Admin only), and Search API supporting make, model, category, color, fuel_type, and price range.

**Actions Taken:**
- Implemented `vehicle_router.py` with multi-criteria search.

---

## Step 8: Indian Rupees (₹) & Customer Purchase / Test Drive Flow
**Prompt:**
> Replace USD prices with Indian Rupees (₹) using Indian numbering format. Implement Customer Purchase dialog and Test Drive Booking without creating separate pages. Disable both Purchase and Book Test Drive buttons when vehicle quantity equals zero.

**Actions Taken:**
- Created `formatINR` in `formatters.js`.
- Implemented `CustomerModal.jsx` and `TestDriveModal.jsx`.
- Added stock guard logic in `VehicleCard.jsx` disabling buttons when stock = 0 (`Out of Stock` & `Book Test Drive (Disabled)`).

---

## Step 9: Login Entry Point & Protected Route Guards
**Prompt:**
> Make Login page the application's entry point ('/' redirects to '/login'). Protect routes '/dashboard', '/admin', '/analytics' so unauthenticated users are redirected to '/login'.

**Actions Taken:**
- Updated `App.jsx` with React Router `<Navigate to="/login" replace />` guards for all protected routes and wildcard URL paths.

---

## Step 10: Business Analytics & Database Integration
**Prompt:**
> Fix Business Analytics page to read directly from database sales and test_drives tables. Display 4 summary cards, vehicle-wise purchase/test drive count lists, and exactly 2 Recharts Bar Charts.

**Actions Taken:**
- Created `AnalyticsService` and `AnalyticsPanel.jsx` rendering 4 summary cards, count lists with fallback text when empty, and 2 Recharts Bar Charts.

---

## Step 11: 12-Vehicle Photo Catalog Sync
**Prompt:**
> Add data and images matching the 12 vehicles in the provided photo (Ford F-150 Lightning, Chevrolet Corvette Z06, Toyota Camry XSE, BMW M5 Competition, Porsche 911 GT3 RS, Audi RS e-tron GT, Tata Harrier, Tesla Model S Plaid, Mercedes-Benz G 63 AMG, Hyundai Creta SX, Maruti Suzuki Swift VXi, Kia Seltos HTX).

**Actions Taken:**
- Updated `seed.py` and `formatters.js` model image mappings for all 12 exact vehicles.

---

## Step 12: Streamline Admin Panel
**Prompt:**
> Business Analytics option is available in admin panel and analytics so remove from admin panel.

**Actions Taken:**
- Removed tab switching strip and embedded `AnalyticsPanel` from `AdminPanel.jsx`. Admin Panel focuses purely on Inventory Catalog management and staff registration.

---

## Step 13: Dropdown Enhancements & Proper Case Colors
**Prompt:**
> Add Power Petrol in fuel type drop list and add Performance in categories drop list. Change color text (Proper Case).

**Actions Taken:**
- Added `Power Petrol` to fuel types and `Performance` to categories in `SearchFilters.jsx` and `VehicleModal.jsx`.
- Added `toProperCase` helper function in `formatters.js` and applied it across Vehicle Cards, Admin Inventory Table, and forms.

---

## Step 14: Comprehensive Pytest Test Suite
**Prompt:**
> Write comprehensive Pytest test cases covering authentication, CRUD, search filtering, purchase, test drives, image upload, and analytics.

**Actions Taken:**
- Built 20 Pytest test cases in `backend/tests/`. All 20 tests pass 100%.
