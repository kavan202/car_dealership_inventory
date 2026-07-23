import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.base import Base
from app.models.user import User, UserRole
from app.models.vehicle import Vehicle
from app.models.customer import Customer
from app.models.sale import Sale
from app.models.testdrive import TestDrive
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
                Vehicle(make="Tesla", model="Model S Plaid", category="Electric", color="Pearl White", fuel_type="EV", price=8999000.0, quantity=4),
                Vehicle(make="Porsche", model="911 GT3 RS", category="Sports", color="Guards Red", fuel_type="Petrol", price=22380000.0, quantity=2),
                Vehicle(make="BMW", model="M5 Competition", category="Luxury", color="Marina Bay Blue", fuel_type="Hybrid", price=11110000.0, quantity=3),
                Vehicle(make="Mercedes-Benz", model="G 63 AMG", category="SUV", color="Obsidian Black", fuel_type="Petrol", price=17900000.0, quantity=1),
                Vehicle(make="Ford", model="F-150 Lightning", category="Truck", color="Oxford White", fuel_type="EV", price=5499500.0, quantity=6),
                Vehicle(make="Audi", model="RS e-tron GT", category="Electric", color="Tactical Green", fuel_type="EV", price=10650000.0, quantity=0),
                Vehicle(make="Toyota", model="Camry XSE", category="Sedan", color="Celestial Silver", fuel_type="Hybrid", price=3142000.0, quantity=8),
                Vehicle(make="Chevrolet", model="Corvette Z06", category="Sports", color="Torch Red", fuel_type="Petrol", price=10650000.0, quantity=2),
            ]
            db.add_all(sample_vehicles)
            db.commit()

        # Seed sample Customer & Sales & Test Drive for Initial Analytics
        if db.query(Customer).count() == 0:
            c1 = Customer(full_name="Rajesh Sharma", mobile_number="9876543210", email="rajesh@example.com")
            c2 = Customer(full_name="Priya Patel", mobile_number="9123456789", email="priya@example.com")
            db.add_all([c1, c2])
            db.commit()

            v1 = db.query(Vehicle).first()
            if v1:
                s1 = Sale(vehicle_id=v1.id, customer_id=c1.id, sale_price=v1.price)
                td1 = TestDrive(vehicle_id=v1.id, customer_name=c1.full_name, customer_phone=c1.mobile_number, customer_email=c1.email, status="Scheduled")
                db.add_all([s1, td1])
                db.commit()

        print("Database seeded successfully with users, sample vehicles, customer records, and test drives!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
