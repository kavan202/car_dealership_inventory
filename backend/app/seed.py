import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.base import Base
from app.models.user import User, UserRole
from app.models.vehicle import Vehicle
from app.auth import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed Admin user if not exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                email="admin@autovault.com",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.ADMIN.value
            )
            db.add(admin)

        # Seed Standard user if not exists
        user = db.query(User).filter(User.username == "user").first()
        if not user:
            user = User(
                username="user",
                email="buyer@autovault.com",
                hashed_password=get_password_hash("user123"),
                role=UserRole.USER.value
            )
            db.add(user)

        # Seed Vehicles if empty
        if db.query(Vehicle).count() == 0:
            sample_vehicles = [
                Vehicle(make="Tesla", model="Model S Plaid", category="Electric", price=89990.0, quantity=4),
                Vehicle(make="Porsche", model="911 GT3 RS", category="Sports", price=223800.0, quantity=2),
                Vehicle(make="BMW", model="M5 Competition", category="Luxury", price=111100.0, quantity=3),
                Vehicle(make="Mercedes-Benz", model="G 63 AMG", category="SUV", price=179000.0, quantity=1),
                Vehicle(make="Ford", model="F-150 Lightning", category="Truck", price=54995.0, quantity=6),
                Vehicle(make="Audi", model="RS e-tron GT", category="Electric", price=106500.0, quantity=0),
                Vehicle(make="Toyota", model="Camry XSE", category="Sedan", price=31420.0, quantity=8),
                Vehicle(make="Chevrolet", model="Corvette Z06", category="Sports", price=106500.0, quantity=2),
            ]
            db.add_all(sample_vehicles)

        db.commit()
        print("Database seeded successfully with users and sample vehicles!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
