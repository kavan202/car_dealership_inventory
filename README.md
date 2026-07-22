# Car Dealership Inventory System

A modern, full-stack Car Dealership Inventory System featuring a FastAPI RESTful backend, PostgreSQL database with Alembic migrations, Pytest TDD suite, and a React SPA frontend with Tailwind CSS.

## Features

- **Authentication & RBAC**: JWT token authentication with user and admin role permissions.
- **Vehicle Inventory Management**: Complete CRUD operations for vehicle records.
- **Search & Filtering**: Multi-criteria search by make, model, category, and price range.
- **Inventory Actions**: Real-time vehicle purchasing (decrementing stock) and admin restocking (incrementing stock).
- **Responsive Modern UI**: Dynamic glassmorphic UI built with React, Vite, and Tailwind CSS.
- **Test-Driven Development**: High test coverage using Pytest.

---

## Tech Stack

### Backend
- **Framework**: Python 3.12 + FastAPI
- **Database & ORM**: PostgreSQL + SQLAlchemy + Alembic
- **Auth & Security**: PyJWT + Passlib (bcrypt) + OAuth2 Bearer
- **Testing**: Pytest + HTTPX

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Routing & Networking**: React Router DOM v6 + Axios

---

## My AI Usage

### Tools Used
- **Antigravity (Google DeepMind AI)**: Used for architecture design, boilerplate generation, TDD test creation, backend API endpoints, responsive React components, and documentation generation.

### Workflow & Impact
1. **Architecture & Planning**: Antigravity generated the modular clean architecture folder layout for backend routers, models, schemas, services, and frontend pages/components.
2. **Test-Driven Development (TDD)**: Unit tests for User, Vehicle, Authentication, and Inventory operations were written before feature implementation.
3. **Frontend Aesthetics**: Designed a high-contrast dark-mode UI with subtle micro-animations using custom Tailwind CSS styling.
4. **Git History & Transparency**: Commits were executed iteratively following the 20-step kata guidelines with AI co-authorship tags.

---

## License
MIT License
