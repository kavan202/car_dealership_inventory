# AutoVault - Car Dealership Inventory System

AutoVault is a state-of-the-art, full-stack Car Dealership Inventory Management Application. Built with modern software architecture principles (SOLID, TDD, Clean Architecture), it features a **FastAPI** RESTful backend powered by **PostgreSQL** and **SQLAlchemy ORM**, paired with a dark-mode glassmorphic **React SPA** built with **Vite** and **Tailwind CSS**.

---

## Repository & Tech Stack

- **GitHub Repository**: [https://github.com/kavan202/car_dealership_inventory.git](https://github.com/kavan202/car_dealership_inventory.git)

### Backend
- **Framework**: Python 3.12 + FastAPI
- **Database**: PostgreSQL 18 (with SQLite in-memory fallback for isolated testing)
- **ORM & Migrations**: SQLAlchemy 2.0 + Alembic
- **Authentication**: OAuth2 + PyJWT + Passlib (bcrypt)
- **Validation**: Pydantic v2 + email-validator
- **Testing**: Pytest + HTTPX

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Lucide Icons + Custom Glassmorphism System
- **Routing & Networking**: React Router DOM v6 + Axios (with JWT interceptors)

---

## Architecture Overview

```
car-dealership-inventory/
├── backend/
│   ├── alembic/              # Alembic database migration scripts
│   ├── app/
│   │   ├── models/           # SQLAlchemy ORM models (User, Vehicle)
│   │   ├── schemas/          # Pydantic v2 data validation schemas
│   │   ├── services/         # Business logic layer (UserService, VehicleService)
│   │   ├── routers/          # RESTful endpoint handlers (auth_router, vehicle_router)
│   │   ├── auth.py           # JWT generation, verification & RBAC dependencies
│   │   ├── config.py         # Environment configuration settings
│   │   ├── database.py       # SQLAlchemy engine & session dependency
│   │   ├── seed.py           # Initial database seeder script
│   │   └── main.py           # FastAPI application entrypoint
│   ├── tests/                # Pytest unit & integration test suite
│   ├── requirements.txt      # Python dependencies
│   └── alembic.ini           # Migration configuration
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, VehicleCard, SearchFilters, Modals)
│   │   ├── context/          # AuthContext provider & custom hooks
│   │   ├── pages/            # View pages (Login, Register, Dashboard, AdminPanel)
│   │   ├── services/         # Axios API service handlers
│   │   ├── App.jsx           # App component with routing & protected routes
│   │   ├── index.css         # Tailwind & custom glassmorphism styles
│   │   └── main.jsx          # React DOM entrypoint
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md                 # Complete project documentation
├── PROMPTS.md                # AI transparency & prompt history log
└── .gitignore
```

---

## Features

1. **Authentication & Authorization**:
   - Register new user accounts with designated roles (`user` or `admin`).
   - Secure login generating JWT access tokens stored in `localStorage`.
   - Role-Based Access Control (RBAC): Admin-only privileges for deleting vehicles, updating catalog records, and restocking inventory.

2. **Vehicle Inventory Management (CRUD)**:
   - View, create, update, and delete vehicle listings.
   - Vehicle attributes: `id`, `make`, `model`, `category`, `price`, `quantity`, `created_at`, `updated_at`.

3. **Multi-Filter Live Search**:
   - Search by make, model, category, minimum price, and maximum price simultaneously.
   - Real-time updates as filters are adjusted.

4. **Purchase & Restock Operations**:
   - **Purchase Vehicle**: Decrements stock quantity by 1 upon purchase. Automatically disables button when quantity reaches 0.
   - **Restock Inventory (Admin)**: Allows admins to add inventory stock units.

---

## Local Installation & Setup Guide

### Prerequisites
- Python 3.12+
- Node.js v18+ & npm
- PostgreSQL 18 (Running locally with user `postgres` and password `admin123`)

### 1. Database Setup
Ensure PostgreSQL is running, then create the `car_inventory` database:
```sql
CREATE DATABASE car_inventory;
```

### 2. Backend Setup
```bash
cd backend

# Create & activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Seed initial database with test users & vehicles
python app/seed.py

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
FastAPI interactive Swagger documentation will be available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The React SPA will open at `http://localhost:3000`.

---

## Default Test Credentials

| Role | Username | Password | Email |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | `admin@autovault.com` |
| **Standard User** | `user` | `user123` | `buyer@autovault.com` |

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register a new user account (`UserCreate` body)
- `POST /api/auth/login` - Authenticate user & return JWT token (`LoginRequest` body)

### Vehicles (Protected)
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Create a new vehicle record
- `GET /api/vehicles/search` - Search vehicles by `make`, `model`, `category`, `min_price`, `max_price`
- `GET /api/vehicles/{id}` - Fetch details of a single vehicle
- `PUT /api/vehicles/{id}` - Update vehicle details
- `DELETE /api/vehicles/{id}` - Delete a vehicle (**Admin Only**)

### Inventory Actions (Protected)
- `POST /api/vehicles/{id}/purchase` - Purchase 1 unit of a vehicle (Decrements quantity)
- `POST /api/vehicles/{id}/restock` - Restock vehicle inventory (**Admin Only**)

---

## Backend Test Report (Pytest)

Run the full Pytest suite from the `backend/` directory:
```bash
pytest -v
```

### Test Suite Execution Summary
```
============================= test session starts =============================
platform win32 -- Python 3.12.2, pytest-8.1.1, pluggy-1.6.0
collected 16 items

tests/test_auth.py::test_register_user_success PASSED                    [  6%]
tests/test_auth.py::test_register_duplicate_username PASSED              [ 12%]
tests/test_auth.py::test_login_success PASSED                            [ 18%]
tests/test_auth.py::test_login_invalid_credentials PASSED                [ 25%]
tests/test_user_model.py::test_user_creation PASSED                      [ 31%]
tests/test_user_model.py::test_admin_user_role PASSED                    [ 37%]
tests/test_user_model.py::test_user_schema_validation PASSED             [ 43%]
tests/test_vehicles.py::test_create_vehicle PASSED                       [ 50%]
tests/test_vehicles.py::test_list_vehicles PASSED                        [ 56%]
tests/test_vehicles.py::test_update_vehicle PASSED                       [ 62%]
tests/test_vehicles.py::test_delete_vehicle_forbidden_for_normal_user PASSED [ 68%]
tests/test_vehicles.py::test_delete_vehicle_success_for_admin PASSED     [ 75%]
tests/test_vehicles.py::test_search_vehicles_filtering PASSED            [ 81%]
tests/test_vehicles.py::test_purchase_vehicle_success PASSED             [ 87%]
tests/test_vehicles.py::test_purchase_vehicle_out_of_stock PASSED        [ 93%]
tests/test_vehicles.py::test_restock_vehicle_admin_only PASSED           [100%]

======================= 16 passed in 1.04s =======================
```

---

## My AI Usage

### 1. Tools Used
- **Antigravity AI (Google DeepMind)**: Used as the primary agentic AI assistant for software architecture planning, clean-code boilerplate generation, TDD test suite authoring, database migrations, React components, and technical documentation.

### 2. How AI Was Leveraged
- **Planning & Architecture**: Drafted the 20-step execution plan following clean architecture principles (decoupling routers, models, schemas, and services).
- **Test-Driven Development (TDD)**: Assisted in writing isolated Pytest unit and integration test cases covering authentication, authorization, vehicle CRUD, multi-criteria search, purchase decrements, and admin restocking.
- **Frontend Design Excellence**: Crafted a responsive, dark-mode glassmorphism design system using Tailwind CSS, dynamic Lucide icons, and micro-animations.
- **Git Commit Co-authorship**: Applied incremental Git commits following the step-by-step specification with explicit co-author metadata trailers.

### 3. Reflection on AI Impact
Utilizing Antigravity AI transformed the software engineering process into a structured, highly reliable pair-programming workflow. The ability to write automated tests prior to feature implementation ensured zero regressions, while clean architecture boundaries made the code maintainable and extensible.

---

## License
MIT License - AutoVault Car Dealership Inventory System
